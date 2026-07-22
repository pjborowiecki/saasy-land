import type { UserValidationMessageKey } from "~/src/integrations/next-intl/i18n.types"

/** Keys under `user.validations` — translate at the UI with `useTranslations("user.validations")`. */
export const USER_VALIDATION_MESSAGE = {
  atLeastOneFieldRequired: "atLeastOneFieldRequired",
} as const satisfies Record<string, UserValidationMessageKey>
