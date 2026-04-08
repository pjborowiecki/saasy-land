import * as rootParams from "next/root-params"

import { getRequestConfig } from "next-intl/server"

import { getFormats } from "~/src/integrations/next-intl/i18n.formats"
import { routing } from "~/src/integrations/next-intl/i18n.routing"

export default getRequestConfig(async ({ locale }) => {
  const target = locale ?? (await rootParams.locale())
  const resolvedLocale = routing.locales.find((locale) => locale === target) ?? routing.defaultLocale

  return {
    locale: resolvedLocale,
    formats: getFormats(resolvedLocale),
    messages: (await import(`./messages/${resolvedLocale}.json`)).default,
  }
})
