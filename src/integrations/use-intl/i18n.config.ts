import type { LocaleCode } from "~/src/modules/_core/constants/locale"

import { APP_DOMAIN } from "../../presentation/branding/constants.ts"

const SUPPORTED_LOCALES = [
  "en-US",
  "de-DE",
  "es-ES",
  "fr-FR",
  "it-IT",
  "ja-JP",
  "pl-PL",
  "pt-BR",
  "uk-UA",
] as const satisfies readonly LocaleCode[]
const [DEFAULT_LOCALE] = SUPPORTED_LOCALES
export type SupportedLocale = (typeof SUPPORTED_LOCALES)[number]
export type Locale = SupportedLocale
export const I18N = { COOKIE_NAME: `${APP_DOMAIN}_locale`, DEFAULT_LOCALE, SUPPORTED_LOCALES } as const
