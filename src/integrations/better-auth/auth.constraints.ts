/** Shared auth limits and password policy — single source for zod, UI checklists, and i18n params. */

export const BACKUP_CODE_MAX_LENGTH = 12
export const BACKUP_CODE_MIN_LENGTH = 8

export const EMAIL_MAX_LENGTH = 64
export const NAME_MAX_LENGTH = 32

export const PASSWORD_MAX_LENGTH = 1024
export const PASSWORD_MIN_LENGTH = 8

export const TWO_FACTOR_CODE_LENGTH = 6

export const PASSWORD_UPPERCASE_PATTERN = /[A-Z]/u
export const PASSWORD_SPECIAL_CHAR_PATTERN = /[^A-Za-z0-9]/u

export const getPasswordRuleState = (
  password: string,
): {
  readonly hasSpecialChar: boolean
  readonly hasUppercase: boolean
  readonly isMinLength: boolean
} => ({
  hasSpecialChar: PASSWORD_SPECIAL_CHAR_PATTERN.test(password),
  hasUppercase: PASSWORD_UPPERCASE_PATTERN.test(password),
  isMinLength: password.length >= PASSWORD_MIN_LENGTH,
})
