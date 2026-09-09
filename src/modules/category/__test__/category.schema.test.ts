import { drizzleAdapter } from "better-auth/adapters/drizzle"
import { describe, expect, it } from "vite-plus/test"

import { category, categoryIconEnum, categoryKindEnum, categoryVisibilityEnum } from "~/src/modules/category/category.schema"

describe("category schema", () => {
  it("materializes through drizzle adapter", () => {
    expect.hasAssertions()
    expect(
      drizzleAdapter(
        {},
        {
          provider: "sqlite",
          schema: { category },
        },
      ),
    ).toBeDefined()
  })

  it("defines enums and updatedAt onUpdate", () => {
    expect.hasAssertions()
    expect(categoryIconEnum.enumValues).toStrictEqual(["Archive", "FolderOpen", "Puzzle"])
    expect(categoryKindEnum.enumValues).toStrictEqual(["category", "collection"])
    expect(categoryVisibilityEnum.enumValues).toStrictEqual(["public", "hidden"])
    const onUpdate = category.updatedAt.onUpdateFn
    expect(onUpdate).toBeDefined()
    expect(onUpdate?.()).toBeInstanceOf(Date)
  })
})
