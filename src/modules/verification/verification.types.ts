import type { verification } from "~/src/modules/verification/verification.schema"

export interface Verification {
  select: typeof verification.$inferSelect
  insert: typeof verification.$inferInsert
}
