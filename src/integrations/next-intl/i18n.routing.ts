import { defineRouting } from "next-intl/routing"

import { CONSTANTS } from "~/src/constants"

export const routing = defineRouting({
  locales: CONSTANTS.LOCALES,
  defaultLocale: CONSTANTS.DEFAULT_LOCALE,
  alternateLinks: false,
  localePrefix: {
    mode: "always",
    prefixes: {
      "en-US": "/en",
      "pl-PL": "/pl",
    },
  },
})
