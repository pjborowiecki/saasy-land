import type { category } from "~/src/modules/category/category.schema"

export interface Category {
  select: typeof category.$inferSelect
  insert: typeof category.$inferInsert
}
