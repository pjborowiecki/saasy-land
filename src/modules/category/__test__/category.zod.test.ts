import { CATEGORY_VALIDATION_MESSAGE } from "~/src/modules/category/category.validations"
import { categoryZodSchemas } from "~/src/modules/category/category.zod"

describe("category zod schemas", () => {
  it("rejects empty select payloads", () => {
    expect.hasAssertions()
    expect(categoryZodSchemas.select.safeParse({}).success).toBe(false)
  })

  it("accepts valid create payloads", () => {
    expect.hasAssertions()
    expect(
      categoryZodSchemas.createCategory.safeParse({
        kind: "category",
        name: "SaaS Plans",
      }).success,
    ).toBe(true)
  })

  it("rejects update payloads with no mutable fields", () => {
    expect.hasAssertions()
    expect(
      categoryZodSchemas.updateCategory
        .safeParse({
          categoryId: "01900000-0000-7000-8000-000000000002",
        })
        .error?.issues.some((issue) => issue.message === CATEGORY_VALIDATION_MESSAGE.atLeastOneFieldRequired),
    ).toBe(true)
  })
})
