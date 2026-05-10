import { CURRENCIES, DEFAULT_CURRENCY } from "~/src/constants/_constants/currencies"
import { DEFAULT_LOCALE, LOCALE_COOKIE_NAME, LOCALES } from "~/src/constants/_constants/locales"
import { ROUTES } from "~/src/constants/_constants/routes"

export const CONSTANTS = {
  APP_NAME: "SaaSy Land",
  APP_GITHUB_OWNER: "pjborowiecki",
  APP_GITHUB_REPO: "saasyland.com",
  APP_GITHUB_URL: "https://github.com/pjborowiecki/saasyland.com",
  DEFAULT_APP_URL: "http://localhost:3000",
  CONTACT_EMAIL: "hello@saasyland.com",
  LOCALE_COOKIE_NAME,
  DEFAULT_LOCALE,
  LOCALES,
  CURRENCIES,
  DEFAULT_CURRENCY,
  ROUTES,
} as const
