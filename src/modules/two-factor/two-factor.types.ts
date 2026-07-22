import type { twoFactor } from "~/src/modules/two-factor/two-factor.schema"

export interface TwoFactor {
  select: typeof twoFactor.$inferSelect
  insert: typeof twoFactor.$inferInsert
}

export interface TwoFactorEnableData {
  backupCodes: readonly string[]
  totpURI: string
}
