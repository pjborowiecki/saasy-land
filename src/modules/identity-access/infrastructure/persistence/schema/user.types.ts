import type { user } from "~/src/modules/identity-access/infrastructure/persistence/schema/user.table"

export interface User {
  select: typeof user.$inferSelect
  insert: typeof user.$inferInsert
}
