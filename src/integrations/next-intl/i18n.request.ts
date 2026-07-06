import { cacheLife } from "next/cache"

import { getRequestConfig } from "next-intl/server"

import { getFormats } from "~/src/integrations/next-intl/i18n.formats"
import { isLocale } from "~/src/integrations/next-intl/i18n.locale"
import { routing } from "~/src/integrations/next-intl/i18n.routing"
import { loadLocaleMessagesFromDir, type Messages } from "~/src/integrations/next-intl/i18n.utils"

async function resolveRootLocale(): Promise<string | undefined> {
  const rootParamsModule: unknown = await import("next/root-params")

  if (typeof rootParamsModule !== "object" || rootParamsModule === null || !("locale" in rootParamsModule)) {
    return undefined
  }

  const localeProp = rootParamsModule["locale"]

  if (typeof localeProp === "function") {
    const resolved: unknown = await localeProp.call(rootParamsModule)
    return typeof resolved === "string" ? resolved : undefined
  }

  return undefined
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
  return {
    formats: getFormats(resolvedLocale),
    locale: resolvedLocale,
    messages: await getCachedLocaleMessages(resolvedLocale),
  }
})
