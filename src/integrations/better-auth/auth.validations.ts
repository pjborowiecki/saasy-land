import {
  BACKUP_CODE_MAX_LENGTH,
  EMAIL_MAX_LENGTH,
  NAME_MAX_LENGTH,
  PASSWORD_MAX_LENGTH,
  PASSWORD_MIN_LENGTH,
  TWO_FACTOR_CODE_LENGTH,
} from "~/src/integrations/better-auth/auth.constraints"
import type { AuthValidationMessageKey } from "~/src/integrations/use-intl/i18n.types"

/** Keys under `auth.validations` — translate at the UI with `useTranslations("auth.validations")`. */
export const AUTH_VALIDATION_MESSAGE = {
  backupCodeMaxLength: "backupCodeMaxLength",
  backupCodeRequired: "backupCodeRequired",
  confirmPasswordRequired: "confirmPasswordRequired",
  emailInvalid: "emailInvalid",
  emailMaxLength: "emailMaxLength",
  emailRequired: "emailRequired",
  nameMaxLength: "nameMaxLength",
  nameRequired: "nameRequired",
  passwordMaxLength: "passwordMaxLength",
  passwordMinLength: "passwordMinLength",
  passwordRequired: "passwordRequired",
  passwordSpecialCharacter: "passwordSpecialCharacter",
  passwordUppercase: "passwordUppercase",
  passwordsMustMatch: "passwordsMustMatch",
  twoFactorCodeLength: "twoFactorCodeLength",
  twoFactorCodeRequired: "twoFactorCodeRequired",
} as const satisfies Record<string, AuthValidationMessageKey>

export const AUTH_VALIDATION_PARAMS = {
  backupCodeMaxLength: { max: BACKUP_CODE_MAX_LENGTH },
  emailMaxLength: { max: EMAIL_MAX_LENGTH },
  nameMaxLength: { max: NAME_MAX_LENGTH },
  passwordMaxLength: { max: PASSWORD_MAX_LENGTH },
  passwordMinLength: { min: PASSWORD_MIN_LENGTH },
  twoFactorCodeLength: { length: TWO_FACTOR_CODE_LENGTH },
} as const satisfies Partial<Record<keyof typeof AUTH_VALIDATION_MESSAGE, Record<string, string | number>>>
