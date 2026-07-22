import * as catalogSchema from "~/src/modules/catalog/infrastructure/persistence/schema"
import { product, productUpdatedAtNow } from "~/src/modules/catalog/infrastructure/persistence/schema/product.table"

describe("catalog persistence schema", () => {
  it("re-exports product table symbols", () => {
    expect.hasAssertions()
    expect(catalogSchema.product).toBe(product)
    expect(catalogSchema.productStatusEnum).toBeDefined()
    expect(catalogSchema.productTypeEnum).toBeDefined()
  })

  it("returns a date from the updatedAt onUpdate callback", () => {
    expect.hasAssertions()
    expect(productUpdatedAtNow()).toBeInstanceOf(Date)
  })
})
