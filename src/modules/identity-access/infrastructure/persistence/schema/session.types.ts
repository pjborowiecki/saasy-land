import type { session } from "~/src/modules/identity-access/infrastructure/persistence/schema/session.table"

export interface Session {
  select: typeof session.$inferSelect
  insert: typeof session.$inferInsert
}
