import { defineRouting } from "next-intl/routing"

import { CONSTANTS } from "~/src/constants"

export const routing = defineRouting({
  locales: CONSTANTS.I18N.LOCALES,
  defaultLocale: CONSTANTS.I18N.DEFAULT_LOCALE,
  alternateLinks: true,
  localeDetection: false,
  localePrefix: {
    mode: "as-needed",
    prefixes: {
      "en-US": "/en",
      "pl-PL": "/pl",
    },
  },
})
