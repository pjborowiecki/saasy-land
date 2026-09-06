import { describe, expect, it } from "vite-plus/test"

import { CATEGORY_VALIDATION_MESSAGE, CATEGORY_VALIDATION_PARAMS } from "~/src/modules/category/category.validations"

describe("category validation messages", () => {
  it("stores message keys aligned with category.validations translations", () => {
    expect.hasAssertions()
    expect(CATEGORY_VALIDATION_MESSAGE.atLeastOneFieldRequired).toBe("atLeastOneFieldRequired")
    expect(CATEGORY_VALIDATION_MESSAGE.nameRequired).toBe("nameRequired")
  })

  it("provides interpolation params for length-based messages", () => {
    expect.hasAssertions()
    expect(CATEGORY_VALIDATION_PARAMS.nameMaxLength).toStrictEqual({ max: 255 })
  })
})
