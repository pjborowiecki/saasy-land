import type { LocaleCode } from "~/src/modules/_core/constants/locale"

const COOKIE_NAME = "NEXT_LOCALE" as const

/** App-enabled UI locales (subset of the shared-kernel locale catalog). */
const LOCALES = ["en-US", "pl-PL"] as const satisfies readonly LocaleCode[]

const [DEFAULT_LOCALE] = LOCALES

export const I18N = {
  COOKIE_NAME,
  DEFAULT_LOCALE,
  LOCALES,
} as const

export type Locale = (typeof I18N.LOCALES)[number]
export type DefaultLocale = typeof I18N.DEFAULT_LOCALE
