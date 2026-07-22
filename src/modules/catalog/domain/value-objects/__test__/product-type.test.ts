import { ProductType } from "~/src/modules/catalog/domain/value-objects/product-type"
import { DomainError } from "~/src/modules/shared-kernel/domain/types/domain-error"

describe("product type value object", () => {
  it("creates known types", () => {
    expect.hasAssertions()
    expect(ProductType.create("one_time").value).toBe("one_time")
    expect(ProductType.create("subscription").value).toBe("subscription")
    expect(ProductType.create("course").value).toBe("course")
  })

  it("rejects unknown types", () => {
    expect.hasAssertions()
    expect(() => ProductType.create("bundle")).toThrow(DomainError)
  })
})
