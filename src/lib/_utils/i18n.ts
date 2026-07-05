import { createTranslator, type AbstractIntlMessages } from "next-intl"

import type { Locale } from "~/src/constants/types"

export type StringTranslator = (key: string, values?: Record<string, string | number | Date>) => string

interface MessagesModule {
  default: AbstractIntlMessages
}

function isMessagesModule(value: unknown): value is MessagesModule {
  return typeof value === "object" && value !== null && "default" in value && typeof value.default === "object" && value.default !== null
}

export async function loadLocaleMessages(locale: Locale): Promise<AbstractIntlMessages> {
  const messagesModule: unknown = await import(`~/src/integrations/next-intl/messages/${locale}.json`)

  if (!isMessagesModule(messagesModule)) {
    throw new Error(`Invalid messages module for locale "${locale}"`)
  }

  return messagesModule.default
}

function wrapTranslator(translator: ReturnType<typeof createTranslator>): StringTranslator {
  return (key, values) => translator(key, values)
}

export function createNamespacedTranslator(messages: AbstractIntlMessages, locale: Locale, namespace: string): StringTranslator {
  return wrapTranslator(createTranslator({ locale, messages, namespace }))
}

export function createRootTranslator(messages: AbstractIntlMessages, locale: Locale): StringTranslator {
  return wrapTranslator(createTranslator({ locale, messages }))
}
