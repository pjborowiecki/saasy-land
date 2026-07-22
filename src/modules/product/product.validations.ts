import type { ProductValidationMessageKey } from "~/src/integrations/next-intl/i18n.types"

const PRODUCT_NAME_MAX_LENGTH = 255

/** Keys under `product.validations` — translate at the UI with `useTranslations("product.validations")`. */
export const PRODUCT_VALIDATION_MESSAGE = {
  atLeastOneFieldRequired: "atLeastOneFieldRequired",
  nameMaxLength: "nameMaxLength",
  nameRequired: "nameRequired",
  priceCentsMin: "priceCentsMin",
} as const satisfies Record<string, ProductValidationMessageKey>

export const PRODUCT_VALIDATION_PARAMS = {
  nameMaxLength: { max: PRODUCT_NAME_MAX_LENGTH },
} as const satisfies Partial<Record<keyof typeof PRODUCT_VALIDATION_MESSAGE, Record<string, string | number>>>
