import { CURRENCIES, DEFAULT_CURRENCY } from "~/src/constants/_constants/currencies"
import { DEFAULT_LOCALE, LOCALE_COOKIE_NAME, LOCALES } from "~/src/constants/_constants/locales"
import { ROUTES } from "~/src/constants/_constants/routes"

export const CONSTANTS = {
  APP_NAME: "SaaSy Land",
  DEFAULT_APP_URL: "http://localhost:3000",
  APP_GITHUB_OWNER: "pjborowiecki",
  APP_GITHUB_REPO: "saasyland.com",
  LOCALE_COOKIE_NAME,
  DEFAULT_LOCALE,
  LOCALES,
  CURRENCIES,
  DEFAULT_CURRENCY,
  ROUTES,
} as const
