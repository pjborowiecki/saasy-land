import type { CategoryValidationMessageKey } from "~/src/integrations/use-intl/i18n.types"

const CATEGORY_NAME_MAX_LENGTH = 255

/** Keys under `category.validations` — translate at the UI with `useTranslations("category.validations")`. */
export const CATEGORY_VALIDATION_MESSAGE = {
  atLeastOneFieldRequired: "atLeastOneFieldRequired",
  nameMaxLength: "nameMaxLength",
  nameRequired: "nameRequired",
} as const satisfies Record<string, CategoryValidationMessageKey>

export const CATEGORY_VALIDATION_PARAMS = {
  nameMaxLength: { max: CATEGORY_NAME_MAX_LENGTH },
} as const satisfies Partial<Record<keyof typeof CATEGORY_VALIDATION_MESSAGE, Record<string, string | number>>>
