import type { account } from "~/src/modules/identity-access/infrastructure/persistence/schema/account.table"

export interface Account {
  select: typeof account.$inferSelect
  insert: typeof account.$inferInsert
}
