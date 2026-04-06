import type { user } from "~/src/modules/user/user.schema"

export interface User {
  select: typeof user.$inferSelect
  insert: typeof user.$inferInsert
}
