import "@tanstack/react-start/server-only"

import { env } from "cloudflare:workers"

import type { Discount } from "@polar-sh/sdk/models/components/discount.js"

import { polar } from "~/src/integrations/polar/polar.config"

import { getPppPercentOff } from "~/src/modules/_core/constants/pricing"

export const COUNTRY_HEADER = "cf-ipcountry"

const BASIS_POINTS_PER_PERCENT = 100
const DISCOUNT_PAGE_SIZE = 100
const NO_DISCOUNT = 0

type PercentageDiscount = Extract<Discount, { basisPoints: number }>

const isAutomaticPercentage = (discount: Discount): discount is PercentageDiscount =>
  discount.type === "percentage" && discount.code === null

const cache: { byPercentOff?: Promise<ReadonlyMap<number, string>> } = {}

const loadDiscounts = async (): Promise<ReadonlyMap<number, string>> => {
  const found = new Map<number, string>()

  try {
    const pages = await polar.discounts.list({ limit: DISCOUNT_PAGE_SIZE, organizationId: env.POLAR_ORGANIZATION_ID })

    for await (const page of pages) {
      for (const discount of page.result.items.filter((item) => isAutomaticPercentage(item))) {
        found.set(discount.basisPoints / BASIS_POINTS_PER_PERCENT, discount.id)
      }
    }
  } catch {
    return found
  }

  return found
}

export const pppDiscountId = async (headers: Headers): Promise<string | undefined> => {
  const percentOff = getPppPercentOff(headers.get(COUNTRY_HEADER) ?? undefined)

  if (percentOff === NO_DISCOUNT) {
    return undefined
  }

  cache.byPercentOff ??= loadDiscounts()
  const discounts = await cache.byPercentOff

  return discounts.get(percentOff)
}
