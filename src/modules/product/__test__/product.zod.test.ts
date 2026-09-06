import { describe, expect, it } from "vite-plus/test"

import { PRODUCT_VALIDATION_MESSAGE } from "~/src/modules/product/product.validations"
import { productZodSchemas } from "~/src/modules/product/product.zod"

describe("product zod schemas", () => {
  it("rejects empty select payloads", () => {
    expect.hasAssertions()
    expect(productZodSchemas.select.safeParse({}).success).toBe(false)
  })

  it("accepts valid create payloads", () => {
    expect.hasAssertions()
    expect(
      productZodSchemas.createProduct.safeParse({
        name: "Starter",
        priceCents: 9900,
        type: "subscription",
      }).success,
    ).toBe(true)
  })

  it("rejects update payloads with no mutable fields", () => {
    expect.hasAssertions()
    expect(
      productZodSchemas.updateProduct
        .safeParse({
          productId: "01900000-0000-7000-8000-000000000002",
        })
        .error?.issues.some((issue) => issue.message === PRODUCT_VALIDATION_MESSAGE.atLeastOneFieldRequired),
    ).toBe(true)
  })
})
