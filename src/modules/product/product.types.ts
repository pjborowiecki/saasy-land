import type { product } from "~/src/modules/product/product.schema"

export interface Product {
  select: typeof product.$inferSelect
  insert: typeof product.$inferInsert
}
