import { defineRouting } from "next-intl/routing"

import { CONSTANTS } from "~/src/constants"
import type { Locale } from "~/src/constants/types"

export const localePathPrefixes = {
  "en-US": "/en",
  "pl-PL": "/pl",
} as const satisfies Partial<Record<Locale, string>>

export const routing = defineRouting({
  alternateLinks: true,
  defaultLocale: CONSTANTS.I18N.DEFAULT_LOCALE,
  localeDetection: false,
  localePrefix: {
    mode: "as-needed",
    prefixes: localePathPrefixes,
  },
  locales: CONSTANTS.I18N.LOCALES,
})
