import type { CONSTANTS } from "~/src/constants"

export type Locale = (typeof CONSTANTS.LOCALES)[number]
export type Currency = (typeof CONSTANTS.CURRENCIES)[Locale]

export type DefaultLocale = typeof CONSTANTS.DEFAULT_LOCALE
export type DefaultCurrency = typeof CONSTANTS.DEFAULT_CURRENCY
