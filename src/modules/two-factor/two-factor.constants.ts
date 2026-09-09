export const TWO_FACTOR_MUTATION_KEYS = {
  ALL: ["two-factor"],
  DISABLE: ["two-factor", "disableTwoFactor"],
  ENABLE: ["two-factor", "enableTwoFactor"],
  VERIFY_BACKUP_CODE: ["two-factor", "verifyBackupCode"],
  VERIFY_TOTP: ["two-factor", "verifyTotp"],
} as const
