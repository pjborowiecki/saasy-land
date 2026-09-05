import type { license } from "~/src/modules/license/license.schema"

export interface License {
  select: typeof license.$inferSelect
  insert: typeof license.$inferInsert
}
