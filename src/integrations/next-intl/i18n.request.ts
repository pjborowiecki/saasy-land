import { cacheLife } from "next/cache"

import { getRequestConfig } from "next-intl/server"

import { isLocale } from "~/src/integrations/next-intl/i18n.locale"
import { routing } from "~/src/integrations/next-intl/i18n.routing"
import { loadLocaleMessagesFromDir, resolveLocaleFromRootParamsModule, type Messages } from "~/src/integrations/next-intl/i18n.utils"

async function resolveRootLocale(): Promise<string | undefined> {
  return resolveLocaleFromRootParamsModule(await import("next/root-params"))
}

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
  const rootLocale = await resolveRootLocale()
  const target = locale ?? rootLocale
  const resolvedLocale = isLocale(target) ? target : routing.defaultLocale
  const isDevelopment = process.env.NODE_ENV === "development"
  return {
    locale: resolvedLocale,
    messages: isDevelopment ? getLocaleMessages(resolvedLocale) : await getCachedLocaleMessages(resolvedLocale),
  }
})
