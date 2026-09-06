import { describe, expect, it } from "vite-plus/test"

import { JSON_NULL } from "~/src/platform/testing/lib/json-null"

import type { Product } from "~/src/modules/product/product.types"

const PRODUCT_ID = "01900000-0000-7000-8000-000000000002"

const makeProductRow = (overrides: Partial<Product["select"]> = {}): Product["select"] => ({
  billingCycle: JSON_NULL,
  createdAt: new Date("2026-01-01T00:00:00.000Z"),
  currency: "USD",
  description: "",
  id: PRODUCT_ID,
  name: "Starter",
  priceCents: 9900,
  status: "draft",
  type: "one_time",
  updatedAt: new Date("2026-01-01T00:00:00.000Z"),
  ...overrides,
})

describe("product types", () => {
  it("builds a select row fixture aligned with the product table", () => {
    expect.hasAssertions()
    expect(makeProductRow().name).toBe("Starter")
    expect(makeProductRow({ status: "published" }).status).toBe("published")
  })
})
