/* eslint-disable unicorn/no-null -- Drizzle nullable columns use null in row fixtures. */
import type { Product } from "~/src/modules/product/product.types"

const PRODUCT_ID = "01900000-0000-7000-8000-000000000002"

function makeProductRow(overrides: Partial<Product["select"]> = {}): Product["select"] {
  return {
    billingCycle: null,
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
  }
}

describe("product types", () => {
  it("builds a select row fixture aligned with the product table", () => {
    expect.hasAssertions()
    expect(makeProductRow().name).toBe("Starter")
    expect(makeProductRow({ status: "published" }).status).toBe("published")
  })
})
