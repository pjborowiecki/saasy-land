import type { VerificationValidationMessageKey } from "~/src/integrations/next-intl/i18n.types"

/** Keys under `verification.validations` — translate at the UI with `useTranslations("verification.validations")`. */
export const VERIFICATION_VALIDATION_MESSAGE = {
  redirectToRequired: "redirectToRequired",
  tokenRequired: "tokenRequired",
} as const satisfies Record<string, VerificationValidationMessageKey>
