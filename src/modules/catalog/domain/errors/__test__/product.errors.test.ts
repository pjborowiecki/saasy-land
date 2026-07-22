import { ProductAlreadyArchivedError } from "~/src/modules/catalog/domain/errors/product-already-archived.error"
import { ProductNotPublishableError } from "~/src/modules/catalog/domain/errors/product-not-publishable.error"

describe("catalog product errors", () => {
  it("constructs archived conflict error", () => {
    expect.hasAssertions()
    const error = new ProductAlreadyArchivedError()
    expect(error.name).toBe("ProductAlreadyArchivedError")
    expect(error.code).toBe("CONFLICT")
    expect(error.message).toBe("Product is already archived")
  })

  it("constructs not-publishable validation error", () => {
    expect.hasAssertions()
    const error = new ProductNotPublishableError()
    expect(error.name).toBe("ProductNotPublishableError")
    expect(error.code).toBe("VALIDATION")
    expect(error.message).toBe("Archived products cannot be published")
  })
})
