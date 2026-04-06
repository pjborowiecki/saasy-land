import type { session } from "~/src/modules/session/session.schema"

export interface Session {
  select: typeof session.$inferSelect
  insert: typeof session.$inferInsert
}
