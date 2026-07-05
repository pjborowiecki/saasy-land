import type { AbstractIntlMessages } from "next-intl"
import { getRequestConfig } from "next-intl/server"

import { getFormats } from "~/src/integrations/next-intl/i18n.formats"
import { isLocale } from "~/src/integrations/next-intl/i18n.locale"
import { routing } from "~/src/integrations/next-intl/i18n.routing"

interface MessagesModule {
  default: AbstractIntlMessages
}

function isMessagesModule(value: unknown): value is MessagesModule {
  return typeof value === "object" && value !== null && "default" in value && typeof value.default === "object" && value.default !== null
}

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

export default getRequestConfig(async ({ locale }) => {
  const rootLocale = await resolveRootLocale()
  const target = locale ?? rootLocale
  const resolvedLocale = isLocale(target) ? target : routing.defaultLocale
  const messagesModule: unknown = await import(`./messages/${resolvedLocale}.json`)

  if (!isMessagesModule(messagesModule)) {
    throw new Error(`Invalid messages module for locale "${resolvedLocale}"`)
  }

  return {
    formats: getFormats(resolvedLocale),
    locale: resolvedLocale,
    messages: messagesModule.default,
  }
})
