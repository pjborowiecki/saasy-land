import { cacheLife } from "next/cache"

import { getRequestConfig } from "next-intl/server"

import { isLocale } from "~/src/integrations/next-intl/i18n.locale"
import { tryRootLocale } from "~/src/integrations/next-intl/i18n.root-params"
import { routing } from "~/src/integrations/next-intl/i18n.routing"
import { loadLocaleMessagesFromDir, type Messages } from "~/src/integrations/next-intl/i18n.utils"

function getLocaleMessages(locale: string): Messages {
  return loadLocaleMessagesFromDir(locale)
}

async function getCachedLocaleMessages(locale: string): Promise<Messages> {
  "use cache"
  cacheLife("max")
  await Promise.resolve()
  return loadLocaleMessagesFromDir(locale)
}

export default getRequestConfig(async ({ locale }) => {
  // Short-circuits before touching root params, which throw outside a route context.
  const target = locale ?? (await tryRootLocale())
  const resolvedLocale = isLocale(target) ? target : routing.defaultLocale
  const isDevelopment = process.env.NODE_ENV === "development"
  return {
    locale: resolvedLocale,
    messages: isDevelopment ? getLocaleMessages(resolvedLocale) : await getCachedLocaleMessages(resolvedLocale),
  }
})
