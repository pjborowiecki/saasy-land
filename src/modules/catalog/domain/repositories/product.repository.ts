import type { Product } from "~/src/modules/catalog/domain/aggregates/product/product.aggregate"
import type { ProductTypeValue } from "~/src/modules/catalog/domain/value-objects/product-type"
import type { EntityId } from "~/src/modules/shared-kernel/domain/value-objects/entity-id"

export interface ProductRepository {
  readonly findById: (id: EntityId) => Promise<Product | undefined>
  readonly list: (options?: { readonly type?: ProductTypeValue }) => Promise<Product[]>
  readonly save: (product: Product) => Promise<void>
}
