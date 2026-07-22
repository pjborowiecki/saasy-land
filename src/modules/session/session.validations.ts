import type { SessionValidationMessageKey } from "~/src/integrations/next-intl/i18n.types"

/** Keys under `session.validations` — translate at the UI with `useTranslations("session.validations")`. */
export const SESSION_VALIDATION_MESSAGE = {
  tokenRequired: "tokenRequired",
} as const satisfies Record<string, SessionValidationMessageKey>
