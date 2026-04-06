import type { account } from "~/src/modules/account/account.schema"

export interface Account {
  select: typeof account.$inferSelect
  insert: typeof account.$inferInsert
}
