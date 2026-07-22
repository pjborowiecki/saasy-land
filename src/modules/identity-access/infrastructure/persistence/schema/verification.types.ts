import type { verification } from "~/src/modules/identity-access/infrastructure/persistence/schema/verification.table"

export interface Verification {
  select: typeof verification.$inferSelect
  insert: typeof verification.$inferInsert
}
