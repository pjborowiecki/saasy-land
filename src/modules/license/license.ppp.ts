import "@tanstack/react-start/server-only"

import { env } from "cloudflare:workers"

import type { Discount } from "@polar-sh/sdk/models/components/discount.js"

import { polar } from "~/src/integrations/polar/polar.config"

import { getPppPercentOff } from "~/src/modules/_core/constants/pricing"

export const COUNTRY_HEADER = "cf-ipcountry"

const BASIS_POINTS_PER_PERCENT = 100
const DISCOUNT_PAGE_SIZE = 100
const DISCOUNT_CACHE_MINUTES = 5
const SECONDS_PER_MINUTE = 60
const MILLISECONDS_PER_SECOND = 1000
const DISCOUNT_CACHE_MS = DISCOUNT_CACHE_MINUTES * SECONDS_PER_MINUTE * MILLISECONDS_PER_SECOND

type PercentageDiscount = Extract<Discount, { basisPoints: number }>

const isAutomaticPercentage = (discount: Discount): discount is PercentageDiscount =>
  discount.type === "percentage" && discount.code === null

const cache: { discounts?: Promise<readonly PercentageDiscount[]>; expiresAt: number } = { expiresAt: 0 }

const loadDiscounts = async (): Promise<readonly PercentageDiscount[]> => {
  const found: PercentageDiscount[] = []

  try {
    const pages = await polar.discounts.list({ limit: DISCOUNT_PAGE_SIZE, organizationId: env.POLAR_ORGANIZATION_ID })

    for await (const page of pages) {
      found.push(...page.result.items.filter(isAutomaticPercentage))
    }
  } catch {
    cache.expiresAt = 0
    return found
  }

  cache.expiresAt = Date.now() + DISCOUNT_CACHE_MS
  return found
}

export const pppDiscountId = async (headers: Headers, productId: string): Promise<string | undefined> => {
  const percentOff = getPppPercentOff(headers.get(COUNTRY_HEADER) ?? undefined)

  if (percentOff === 0) {
    return undefined
  }

  if (!cache.discounts || cache.expiresAt <= Date.now()) {
    // Pending requests share this lookup until it settles.
    cache.expiresAt = Infinity
    cache.discounts = loadDiscounts()
  }
  const discounts = await cache.discounts
  const now = Date.now()

  return discounts.findLast(
    (discount) =>
      discount.basisPoints === percentOff * BASIS_POINTS_PER_PERCENT &&
      (discount.startsAt === null || discount.startsAt.getTime() <= now) &&
      (discount.endsAt === null || discount.endsAt.getTime() > now) &&
      (discount.maxRedemptions === null || discount.redemptionsCount < discount.maxRedemptions) &&
      (discount.products.length === 0 || discount.products.some((product) => product.id === productId)),
  )?.id
}
