import { defineRouting } from "next-intl/routing"

import { I18N, type Locale } from "~/src/integrations/next-intl/i18n.config"

export const localePathPrefixes = {
  "en-US": "/en",
  "pl-PL": "/pl",
} satisfies Partial<Record<Locale, string>>

export const routing = defineRouting({
  alternateLinks: true,
  defaultLocale: I18N.DEFAULT_LOCALE,
  localeDetection: false,
  localePrefix: {
    mode: "as-needed",
    prefixes: localePathPrefixes,
  },
  locales: I18N.LOCALES,
})
