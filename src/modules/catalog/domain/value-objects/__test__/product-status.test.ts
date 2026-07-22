import { ProductStatus } from "~/src/modules/catalog/domain/value-objects/product-status"
import { DomainError } from "~/src/modules/shared-kernel/domain/types/domain-error"

describe("product status value object", () => {
  it("creates known statuses and reports flags", () => {
    expect.hasAssertions()
    expect(ProductStatus.draft().value).toBe("draft")
    expect(ProductStatus.create("published").isPublished()).toBe(true)
    expect(ProductStatus.create("archived").isArchived()).toBe(true)
    expect(ProductStatus.create("draft").isPublished()).toBe(false)
    expect(ProductStatus.create("draft").isArchived()).toBe(false)
  })

  it("rejects unknown statuses", () => {
    expect.hasAssertions()
    expect(() => ProductStatus.create("missing")).toThrow(DomainError)
  })
})
