import { env } from "cloudflare:workers"

import type { Discount } from "@polar-sh/sdk/models/components/discount.js"
import { createPageIterator } from "@polar-sh/sdk/types/operations.js"
import { beforeEach, describe, expect, it, vi } from "vite-plus/test"

import { JSON_NULL } from "~/src/platform/testing/lib/json-null"

import type { polar } from "~/src/integrations/polar/polar.config"

type DiscountPages = Awaited<ReturnType<typeof polar.discounts.list>>
const listDiscountsMock = vi.hoisted(() => vi.fn<typeof polar.discounts.list>())

vi.mock(import("~/src/integrations/polar/polar.config"), async (importOriginal) => {
  const actual = await importOriginal()
  vi.spyOn(actual.polar.discounts, "list").mockImplementation(listDiscountsMock)
  return actual
})

const DISCOUNT_FIELDS = {
  code: JSON_NULL,
  createdAt: new Date("2026-09-08T00:00:00Z"),
  duration: "once" as const,
  endsAt: JSON_NULL,
  maxRedemptions: JSON_NULL,
  metadata: {},
  modifiedAt: JSON_NULL,
  name: "Regional discount",
  organizationId: env.POLAR_ORGANIZATION_ID,
  products: [],
  redemptionsCount: 0,
  startsAt: JSON_NULL,
}

const percentageDiscount = (id: string, basisPoints: number, code: string | null = JSON_NULL): Discount => ({
  ...DISCOUNT_FIELDS,
  basisPoints,
  code,
  id,
  type: "percentage",
})

const discountPages = (...items: Discount[][]): DiscountPages => {
  const pagination = { maxPage: items.length, totalCount: items.flat().length }
  const page = (index: number): DiscountPages => {
    const result = {
      next: () => (index + 1 < items.length ? Promise.resolve(page(index + 1)) : JSON_NULL),
      result: { items: items[index] ?? [], pagination },
    }
    return { ...result, ...createPageIterator(result, () => false) }
  }
  return page(0)
}

const findDiscount = async (country?: string): Promise<string | undefined> => {
  const { COUNTRY_HEADER, pppDiscountId } = await import("~/src/modules/license/license.ppp")
  const headers = new Headers()
  if (country !== undefined) {
    headers.set(COUNTRY_HEADER, country)
  }
  return pppDiscountId(headers)
}

beforeEach(() => {
  vi.resetModules()
  listDiscountsMock.mockReset()
})

describe("regional checkout discounts", () => {
  it.each([undefined, "US", "XX"])("skips the provider for a full-price or missing country: %j", async (country) => {
    await expect(findDiscount(country)).resolves.toBeUndefined()

    expect(listDiscountsMock).not.toHaveBeenCalled()
  })

  it("finds automatic percentage discounts across pages while excluding coupon codes and fixed amounts", async () => {
    const fixed: Discount = { ...DISCOUNT_FIELDS, amount: 3000, amounts: { usd: 3000 }, currency: "usd", id: "fixed", type: "fixed" }
    listDiscountsMock.mockResolvedValue(
      discountPages(
        [percentageDiscount("regional-30", 3000), percentageDiscount("coupon-30", 3000, "LAUNCH30"), fixed],
        [percentageDiscount("regional-50", 5000)],
      ),
    )

    await expect(findDiscount("PL")).resolves.toBe("regional-30")
    await expect(findDiscount("UA")).resolves.toBe("regional-50")
    await expect(findDiscount("IN")).resolves.toBeUndefined()
    expect(listDiscountsMock).toHaveBeenCalledExactlyOnceWith({ limit: 100, organizationId: env.POLAR_ORGANIZATION_ID })
  })

  it("shares one provider lookup across concurrent requests and reuses the result", async () => {
    const response = Promise.withResolvers<DiscountPages>()
    listDiscountsMock.mockReturnValue(response.promise)
    const polish = findDiscount("PL")
    const ukrainian = findDiscount("UA")
    await vi.waitFor(() => {
      expect(listDiscountsMock).toHaveBeenCalledTimes(1)
    })

    response.resolve(discountPages([percentageDiscount("regional-30", 3000), percentageDiscount("regional-50", 5000)]))

    await expect(Promise.all([polish, ukrainian])).resolves.toEqual(["regional-30", "regional-50"])
    await expect(findDiscount("PL")).resolves.toBe("regional-30")
    expect(listDiscountsMock).toHaveBeenCalledTimes(1)
  })

  it("allows checkout without a discount when the provider cannot list discounts", async () => {
    listDiscountsMock.mockRejectedValue(new Error("Provider unavailable"))

    await expect(findDiscount("PL")).resolves.toBeUndefined()

    expect(listDiscountsMock).toHaveBeenCalledTimes(1)
  })
})
