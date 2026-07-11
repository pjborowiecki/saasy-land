export const AUTH_VALIDATIONS = {
  AT_LEAST_MIN_CHARACTERS_LONG: "atLeastMinCharactersLong",
  AT_LEAST_ONE_SPECIAL_CHARACTER: "atLeastOneSpecialCharacter",
  AT_LEAST_ONE_UPPERCASE: "atLeastOneUppercase",
  BACKUP_CODE_MAX_LENGTH: "backupCodeMaxLength",
  BACKUP_CODE_REQUIRED: "backupCodeRequired",
  CONFIRM_PASSWORD_REQUIRED: "confirmPasswordRequired",
  EMAIL_INVALID: "emailInvalid",
  EMAIL_MAX_LENGTH: "emailMaxLength",
  EMAIL_REQUIRED: "emailRequired",
  NAME_MAX_LENGTH: "nameMaxLength",
  NAME_REQUIRED: "nameRequired",
  PASSWORDS_MUST_MATCH: "passwordsMustMatch",
  PASSWORD_MAX_LENGTH: "passwordMaxLength",
  PASSWORD_MIN_LENGTH: "passwordMinLength",
  PASSWORD_REQUIRED: "passwordRequired",
  PASSWORD_SPECIAL_CHARACTER: "passwordSpecialCharacter",
  PASSWORD_UPPERCASE: "passwordUppercase",
  TWO_FACTOR_CODE_LENGTH: "twoFactorCodeLength",
  TWO_FACTOR_CODE_REQUIRED: "twoFactorCodeRequired",
} as const

export type AuthValidationMessageKey = (typeof AUTH_VALIDATIONS)[keyof typeof AUTH_VALIDATIONS]
