import { Product } from "~/src/modules/catalog/domain/aggregates/product/product.aggregate"
import { toDomain, toPersistence } from "~/src/modules/catalog/infrastructure/persistence/mappers/product.mapper"
import type { ProductRow } from "~/src/modules/catalog/infrastructure/persistence/schema/product.table"
import { Currency } from "~/src/modules/shared-kernel/domain/value-objects/currency"

const NOW = new Date("2026-07-21T12:00:00.000Z")
const PRODUCT_ID = "01900000-0000-7000-8000-000000000001"
const PRICE_CENTS = 1000
const COURSE_PRICE_CENTS = 500

function makeRow(overrides: Partial<ProductRow> = {}): ProductRow {
  return {
    billingCycle: "month",
    createdAt: NOW,
    currency: Currency.DEFAULT_CODE,
    description: "Desc",
    id: PRODUCT_ID,
    name: "Kit",
    priceCents: PRICE_CENTS,
    status: "draft",
    type: "one_time",
    updatedAt: NOW,
    ...overrides,
  }
}

describe("product mapper", () => {
  it("maps rows to domain and back", () => {
    expect.hasAssertions()
    const domain = toDomain(makeRow())
    expect(domain.id.value).toBe(PRODUCT_ID)
    expect(domain.billingCycle).toBe("month")
    expect(toPersistence(domain)).toMatchObject({
      id: PRODUCT_ID,
      name: "Kit",
      status: "draft",
    })
  })

  it("treats empty billing cycle as undefined", () => {
    expect.hasAssertions()
    expect(toDomain(makeRow({ billingCycle: "" })).billingCycle).toBeUndefined()
  })

  it("round-trips a created aggregate", () => {
    expect.hasAssertions()
    const product = Product.create({
      currency: Currency.DEFAULT_CODE,
      description: "Fresh",
      id: PRODUCT_ID,
      name: "Fresh",
      now: NOW,
      priceCents: COURSE_PRICE_CENTS,
      type: "course",
    })
    const restored = toDomain(
      makeRow({
        billingCycle: "",
        createdAt: NOW,
        currency: Currency.DEFAULT_CODE,
        description: "Fresh",
        id: PRODUCT_ID,
        name: "Fresh",
        priceCents: COURSE_PRICE_CENTS,
        status: "draft",
        type: "course",
        updatedAt: NOW,
      }),
    )

    expect(toPersistence(product)).toMatchObject({ name: "Fresh", type: "course" })
    expect(restored.name.value).toBe("Fresh")
    expect(restored.type.value).toBe("course")
    expect(restored.billingCycle).toBeUndefined()
  })
})
