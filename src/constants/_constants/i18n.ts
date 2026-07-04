const COOKIE_NAME = "NEXT_LOCALE" as const

const CURRENCIES = {
  "en-US": "USD",
  "pl-PL": "PLN",
} as const

const DEFAULT_LOCALE = "en-US" as const

const DEFAULT_CURRENCY = CURRENCIES[DEFAULT_LOCALE]

const LOCALES = ["en-US", "pl-PL"] as const

export const I18N = {
  COOKIE_NAME,
  CURRENCIES,
  DEFAULT_CURRENCY,
  DEFAULT_LOCALE,
  LOCALES,
} as const
