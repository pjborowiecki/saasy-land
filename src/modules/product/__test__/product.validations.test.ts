import { PRODUCT_VALIDATION_MESSAGE, PRODUCT_VALIDATION_PARAMS } from "~/src/modules/product/product.validations"

describe("product validation messages", () => {
  it("stores message keys aligned with product.validations translations", () => {
    expect.hasAssertions()
    expect(PRODUCT_VALIDATION_MESSAGE.atLeastOneFieldRequired).toBe("atLeastOneFieldRequired")
    expect(PRODUCT_VALIDATION_MESSAGE.nameRequired).toBe("nameRequired")
  })

  it("provides interpolation params for length-based messages", () => {
    expect.hasAssertions()
    expect(PRODUCT_VALIDATION_PARAMS.nameMaxLength).toStrictEqual({ max: 255 })
  })
})
