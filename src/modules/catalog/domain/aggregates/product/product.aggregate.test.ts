import { Product } from "~/src/modules/catalog/domain/aggregates/product/product.aggregate"
import { ProductAlreadyArchivedError } from "~/src/modules/catalog/domain/errors/product-already-archived.error"
import { ProductNotPublishableError } from "~/src/modules/catalog/domain/errors/product-not-publishable.error"
import { ProductStatus } from "~/src/modules/catalog/domain/value-objects/product-status"
import { ProductType } from "~/src/modules/catalog/domain/value-objects/product-type"
import { DomainError } from "~/src/modules/shared-kernel/domain/types/domain-error"
import { Currency } from "~/src/modules/shared-kernel/domain/value-objects/currency"
import { EntityId } from "~/src/modules/shared-kernel/domain/value-objects/entity-id"
import { NonEmptyString } from "~/src/modules/shared-kernel/domain/value-objects/non-empty-string"

const NOW = new Date("2026-07-21T12:00:00.000Z")
const LATER = new Date("2026-07-22T12:00:00.000Z")
const PRODUCT_ID = "01900000-0000-7000-8000-000000000001"
const PRICE_CENTS = 2900
const UPDATED_PRICE_CENTS = 4900
const SINGLE_EVENT_COUNT = 1

function createDraft(overrides: Partial<Parameters<typeof Product.create>[0]> = {}): Product {
  return Product.create({
    currency: Currency.DEFAULT_CODE,
    description: "A digital good",
    id: PRODUCT_ID,
    name: "Starter Kit",
    now: NOW,
    priceCents: PRICE_CENTS,
    type: "one_time",
    ...overrides,
  })
}

describe("product aggregate", () => {
  it("creates a draft subscription with billing cycle", () => {
    expect.hasAssertions()
    const product = createDraft({ billingCycle: "month", type: "subscription" })

    expect(product.status.value).toBe("draft")
    expect(product.type.value).toBe("subscription")
    expect(product.billingCycle).toBe("month")
    expect(product.priceCents).toBe(PRICE_CENTS)
    expect(product.id.value).toBe(PRODUCT_ID)
  })

  it("exposes remaining getters after create", () => {
    expect.hasAssertions()
    const product = createDraft()

    expect(product.currency.code).toBe(Currency.DEFAULT_CODE)
    expect(product.name.value).toBe("Starter Kit")
    expect(product.description).toBe("A digital good")
    expect(product.createdAt).toBe(NOW)
    expect(product.updatedAt).toBe(NOW)
  })

  it("emits and drains create events", () => {
    expect.hasAssertions()
    const product = createDraft()
    const createdEvents = product.pullEvents()

    expect(createdEvents).toHaveLength(SINGLE_EVENT_COUNT)
    expect(createdEvents[0]?.name).toBe("catalog.product.created")
    expect(product.pullEvents()).toHaveLength(0)
  })

  it("publishes and archives with events", () => {
    expect.hasAssertions()
    const product = createDraft()
    product.pullEvents()

    product.publish(LATER)
    expect(product.status.value).toBe("published")
    expect(product.updatedAt).toBe(LATER)
    expect(product.pullEvents()[0]?.name).toBe("catalog.product.published")

    product.archive(LATER)
    expect(product.status.value).toBe("archived")
  })

  it("rejects non-integer or negative prices on create", () => {
    expect.hasAssertions()
    expect(() => createDraft({ priceCents: 1.5 })).toThrow(DomainError)
    expect(() => createDraft({ priceCents: -1 })).toThrow(DomainError)
  })

  it("updates mutable fields", () => {
    expect.hasAssertions()
    const product = createDraft()
    product.pullEvents()

    product.update({
      billingCycle: "year",
      currency: "EUR",
      description: "  Updated  ",
      name: "Pro Kit",
      now: LATER,
      priceCents: UPDATED_PRICE_CENTS,
    })

    expect(product.billingCycle).toBe("year")
    expect(product.currency.code).toBe("EUR")
    expect(product.description).toBe("Updated")
    expect(product.name.value).toBe("Pro Kit")
    expect(product.priceCents).toBe(UPDATED_PRICE_CENTS)
  })

  it("keeps prior fields when update omits them and emits event", () => {
    expect.hasAssertions()
    const product = createDraft()
    product.pullEvents()
    product.update({ now: LATER })

    expect(product.priceCents).toBe(PRICE_CENTS)
    expect(product.updatedAt).toBe(LATER)
    expect(product.pullEvents()[0]?.name).toBe("catalog.product.updated")
  })

  it("rejects archived updates and invalid prices", () => {
    expect.hasAssertions()
    const product = createDraft()
    expect(() => {
      product.update({ now: LATER, priceCents: -5 })
    }).toThrow(DomainError)

    product.archive(LATER)
    expect(() => {
      product.update({ name: "Nope", now: LATER })
    }).toThrow(ProductAlreadyArchivedError)
  })

  it("rejects publishing or re-archiving an archived product", () => {
    expect.hasAssertions()
    const product = createDraft()
    product.archive(LATER)
    expect(() => {
      product.publish(LATER)
    }).toThrow(ProductNotPublishableError)
    expect(() => {
      product.archive(LATER)
    }).toThrow(ProductAlreadyArchivedError)
  })

  it("reconstitutes without domain events", () => {
    expect.hasAssertions()
    const product = Product.reconstitute({
      billingCycle: undefined,
      createdAt: NOW,
      currency: Currency.create(Currency.DEFAULT_CODE),
      description: "recon",
      id: EntityId.create(PRODUCT_ID),
      name: NonEmptyString.create("Recon", "name"),
      priceCents: 100,
      status: ProductStatus.create("published"),
      type: ProductType.create("course"),
      updatedAt: LATER,
    })

    expect(product.status.isPublished()).toBe(true)
    expect(product.type.value).toBe("course")
    expect(product.pullEvents()).toHaveLength(0)
  })
})
