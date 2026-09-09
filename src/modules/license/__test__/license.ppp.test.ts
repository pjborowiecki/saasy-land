import { env } from "cloudflare:workers"

import type { Discount } from "@polar-sh/sdk/models/components/discount.js"
import { createPageIterator } from "@polar-sh/sdk/types/operations.js"
import { afterEach, beforeEach, describe, expect, it, vi } from "vite-plus/test"

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

const discountProduct = (id: string): Discount["products"][number] => ({
  createdAt: DISCOUNT_FIELDS.createdAt,
  description: JSON_NULL,
  id,
  isArchived: false,
  isRecurring: false,
  metadata: {},
  meterInterval: JSON_NULL,
  meterIntervalCount: JSON_NULL,
  modifiedAt: JSON_NULL,
  name: "License",
  organizationId: env.POLAR_ORGANIZATION_ID,
  recurringInterval: JSON_NULL,
  recurringIntervalCount: JSON_NULL,
  trialInterval: JSON_NULL,
  trialIntervalCount: JSON_NULL,
  visibility: "public",
})

const findDiscount = async (country?: string, productId = env.POLAR_PRODUCT_ID_CORE): Promise<string | undefined> => {
  const { COUNTRY_HEADER, pppDiscountId } = await import("~/src/modules/license/license.ppp")
  const headers = new Headers()
  if (country !== undefined) {
    headers.set(COUNTRY_HEADER, country)
  }
  return pppDiscountId(headers, productId)
}

const NOW = Date.parse("2026-09-09T12:00:00Z")

beforeEach(() => {
  vi.resetModules()
  listDiscountsMock.mockReset()
  vi.spyOn(Date, "now").mockReturnValue(NOW)
})

afterEach(() => {
  vi.mocked(Date.now).mockRestore()
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
        [
          percentageDiscount("regional-30", 3000),
          percentageDiscount("fractional", 3001),
          percentageDiscount("coupon-30", 3000, "LAUNCH30"),
          fixed,
        ],
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

  it("retries a failed lookup on the next checkout and caches the recovered discounts", async () => {
    listDiscountsMock
      .mockRejectedValueOnce(new Error("Provider unavailable"))
      .mockResolvedValue(discountPages([percentageDiscount("regional-30", 3000)]))

    await expect(findDiscount("PL")).resolves.toBeUndefined()
    await expect(findDiscount("PL")).resolves.toBe("regional-30")
    await expect(findDiscount("PL")).resolves.toBe("regional-30")
    expect(listDiscountsMock).toHaveBeenCalledTimes(2)
  })

  it("retries an incomplete paginated lookup instead of permanently caching its first page", async () => {
    const firstPage = {
      next: () => Promise.reject(new Error("Next page unavailable")),
      result: {
        items: [percentageDiscount("regional-30", 3000)],
        pagination: { maxPage: 2, totalCount: 2 },
      },
    }
    listDiscountsMock
      .mockResolvedValueOnce({ ...firstPage, ...createPageIterator(firstPage, () => false) })
      .mockResolvedValue(discountPages([percentageDiscount("regional-30", 3000), percentageDiscount("regional-50", 5000)]))

    await expect(findDiscount("PL")).resolves.toBe("regional-30")
    await expect(findDiscount("UA")).resolves.toBe("regional-50")
    expect(listDiscountsMock).toHaveBeenCalledTimes(2)
  })
})

describe("regional discount eligibility", () => {
  it.each([
    { startsAt: new Date(NOW + 1) },
    { endsAt: new Date(NOW) },
    { endsAt: new Date(NOW - 1) },
    { maxRedemptions: 10, redemptionsCount: 10 },
    { maxRedemptions: 10, redemptionsCount: 11 },
  ])("skips an ineligible discount without hiding a valid one: %j", async (restriction) => {
    listDiscountsMock.mockResolvedValue(
      discountPages([percentageDiscount("eligible", 3000), { ...percentageDiscount("ineligible", 3000), ...restriction }]),
    )

    await expect(findDiscount("PL")).resolves.toBe("eligible")
  })

  it("allows active discounts with remaining redemptions", async () => {
    listDiscountsMock.mockResolvedValue(
      discountPages([
        {
          ...percentageDiscount("eligible", 3000),
          endsAt: new Date(NOW + 1000),
          maxRedemptions: 10,
          redemptionsCount: 9,
          startsAt: new Date(NOW),
        },
      ]),
    )

    await expect(findDiscount("PL")).resolves.toBe("eligible")
  })

  it("checks cached start and end dates at checkout time", async () => {
    listDiscountsMock.mockResolvedValue(
      discountPages([{ ...percentageDiscount("scheduled", 3000), endsAt: new Date(NOW + 2000), startsAt: new Date(NOW + 1000) }]),
    )

    await expect(findDiscount("PL")).resolves.toBeUndefined()
    vi.mocked(Date.now).mockReturnValue(NOW + 1000)
    await expect(findDiscount("PL")).resolves.toBe("scheduled")
    vi.mocked(Date.now).mockReturnValue(NOW + 2000)
    await expect(findDiscount("PL")).resolves.toBeUndefined()
    expect(listDiscountsMock).toHaveBeenCalledTimes(1)
  })

  it("resolves discounts for each requested product without mixing tiers", async () => {
    listDiscountsMock.mockResolvedValue(
      discountPages([
        { ...percentageDiscount("core", 3000), products: [discountProduct(env.POLAR_PRODUCT_ID_CORE)] },
        { ...percentageDiscount("agency", 3000), products: [discountProduct(env.POLAR_PRODUCT_ID_AGENCY)] },
      ]),
    )

    await expect(findDiscount("PL", env.POLAR_PRODUCT_ID_CORE)).resolves.toBe("core")
    await expect(findDiscount("PL", env.POLAR_PRODUCT_ID_AGENCY)).resolves.toBe("agency")
    await expect(findDiscount("PL", env.POLAR_PRODUCT_ID_COMPLETE)).resolves.toBeUndefined()
    expect(listDiscountsMock).toHaveBeenCalledTimes(1)
  })
})

describe("regional discount cache refresh", () => {
  it("shares a refresh after five minutes and drops removed discounts", async () => {
    listDiscountsMock.mockResolvedValueOnce(discountPages([percentageDiscount("removed", 3000)]))
    await expect(findDiscount("PL")).resolves.toBe("removed")

    const refresh = Promise.withResolvers<DiscountPages>()
    listDiscountsMock.mockReturnValue(refresh.promise)
    vi.mocked(Date.now).mockReturnValue(NOW + 5 * 60 * 1000)
    const polish = findDiscount("PL")
    const ukrainian = findDiscount("UA")
    await vi.waitFor(() => {
      expect(listDiscountsMock).toHaveBeenCalledTimes(2)
    })
    refresh.resolve(discountPages([percentageDiscount("new", 5000)]))

    await expect(Promise.all([polish, ukrainian])).resolves.toEqual([undefined, "new"])
    await expect(findDiscount("UA")).resolves.toBe("new")
    expect(listDiscountsMock).toHaveBeenCalledTimes(2)
  })

  it("preserves undiscounted checkout after a failed refresh and retries the next request", async () => {
    listDiscountsMock
      .mockResolvedValueOnce(discountPages([percentageDiscount("old", 3000)]))
      .mockRejectedValueOnce(new Error("Provider unavailable"))
      .mockResolvedValue(discountPages([percentageDiscount("recovered", 3000)]))

    await expect(findDiscount("PL")).resolves.toBe("old")
    vi.mocked(Date.now).mockReturnValue(NOW + 5 * 60 * 1000)
    await expect(findDiscount("PL")).resolves.toBeUndefined()
    await expect(findDiscount("PL")).resolves.toBe("recovered")
    expect(listDiscountsMock).toHaveBeenCalledTimes(3)
  })

  it("retries when the SDK throws before returning a request promise", async () => {
    listDiscountsMock
      .mockImplementationOnce(() => {
        throw new Error("SDK validation failed")
      })
      .mockResolvedValue(discountPages([percentageDiscount("recovered", 3000)]))

    await expect(findDiscount("PL")).resolves.toBeUndefined()
    await expect(findDiscount("PL")).resolves.toBe("recovered")
    expect(listDiscountsMock).toHaveBeenCalledTimes(2)
  })
})
