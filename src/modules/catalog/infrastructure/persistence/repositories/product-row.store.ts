import type { ProductTypeValue } from "~/src/modules/catalog/domain/value-objects/product-type"
import type { ProductInsert, ProductRow } from "~/src/modules/catalog/infrastructure/persistence/schema/product.table"

export interface ProductRowStore {
  findById: (id: string) => Promise<ProductRow | undefined>
  list: (type?: ProductTypeValue) => Promise<ProductRow[]>
  upsert: (row: ProductInsert) => Promise<void>
}
