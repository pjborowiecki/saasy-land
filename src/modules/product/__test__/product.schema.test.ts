import { drizzleAdapter } from "better-auth/adapters/drizzle"

import { product, productStatusEnum, productTypeEnum } from "~/src/modules/product/product.schema"

describe("product schema", () => {
  it("materializes through drizzle adapter", () => {
    expect.hasAssertions()
    expect(
      drizzleAdapter(
        {},
        {
          provider: "pg",
          schema: { product },
        },
      ),
    ).toBeDefined()
  })

  it("defines enums and updatedAt onUpdate", () => {
    expect.hasAssertions()
    expect(productStatusEnum.enumValues).toStrictEqual(["draft", "published", "archived"])
    expect(productTypeEnum.enumValues).toStrictEqual(["one_time", "subscription", "course"])
    const onUpdate = product.updatedAt.onUpdateFn
    expect(onUpdate).toBeDefined()
    expect(onUpdate?.()).toBeInstanceOf(Date)
  })
})
