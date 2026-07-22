import type { ProductTypeValue } from "~/src/modules/catalog/domain/value-objects/product-type"

export interface ListProductsQuery {
  readonly type?: ProductTypeValue
}
