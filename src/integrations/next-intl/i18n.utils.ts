import type { AbstractIntlMessages } from "next-intl"
import { readdirSync, readFileSync } from "node:fs"
import { join } from "node:path"

import type enMessages from "./en-US.d.json.ts"

export type Messages = typeof enMessages

type MessageTree = Record<string, unknown>

export function resolveMessagesDir(dirname: string | undefined = import.meta.dirname): string {
  if (typeof dirname === "string") {
    return join(dirname, "messages")
  }

  return join(process.cwd(), "src/integrations/next-intl/messages")
}

const MESSAGES_DIR = resolveMessagesDir()
const localeMessagesCache = new Map<string, Messages>()

function isPlainObject(value: unknown): value is MessageTree {
  return value !== null && typeof value === "object" && !Array.isArray(value)
}

function isIntlMessages(value: MessageTree): value is AbstractIntlMessages {
  return Object.values(value).every((entry) => {
    if (typeof entry === "string") {
      return true
    }

    return isPlainObject(entry) && isIntlMessages(entry)
  })
}

function parseMessageTree(parsed: unknown, sourceLabel: string): MessageTree {
  if (!isPlainObject(parsed)) {
    throw new Error(`Invalid message file: ${sourceLabel}`)
  }

  return parsed
}

function nestMessageFile(filename: string, content: MessageTree): MessageTree {
  const segments = filename
    .replace(/\.json$/u, "")
    .split(".")
    .filter((segment) => segment.length > 0)

  return segments.reduceRight<MessageTree>((nested, segment) => ({ [segment]: nested }), content)
}

function deepMergeMessages(target: MessageTree, source: MessageTree): MessageTree {
  const merged: MessageTree = { ...target }

  for (const [key, value] of Object.entries(source)) {
    const existing = merged[key]
    merged[key] = isPlainObject(existing) && isPlainObject(value) ? deepMergeMessages(existing, value) : value
  }

  return merged
}

function isLocaleMessages(value: MessageTree): value is Messages {
  return isIntlMessages(value)
}

function assertLocaleMessages(messages: MessageTree, locale: string): Messages {
  if (!isLocaleMessages(messages)) {
    throw new Error(`Invalid merged messages for locale "${locale}"`)
  }

  return messages
}

export function getLocaleMessagesDir(): string {
  return MESSAGES_DIR
}

export async function resolveLocaleFromRootParamsModule(rootParamsModule: unknown): Promise<string | undefined> {
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

export function loadLocaleMessagesFromDir(locale: string, messagesDir = MESSAGES_DIR): Messages {
  const cacheKey = `${messagesDir}:${locale}`
  const isDevelopment = process.env.NODE_ENV === "development"
  const cached = isDevelopment ? undefined : localeMessagesCache.get(cacheKey)

  if (cached !== undefined) {
    return cached
  }

  const localeDir = join(messagesDir, locale)
  const files = readdirSync(localeDir)
    .filter((file) => file.endsWith(".json"))
    .toSorted((a, b) => a.localeCompare(b))

  let messages: MessageTree = {}

  for (const file of files) {
    const filePath = join(localeDir, file)
    const content = parseMessageTree(JSON.parse(readFileSync(filePath, "utf8")), filePath)
    const nested = nestMessageFile(file, content)
    messages = deepMergeMessages(messages, nested)
  }

  const resolvedMessages = assertLocaleMessages(messages, locale)

  if (!isDevelopment) {
    localeMessagesCache.set(cacheKey, resolvedMessages)
  }

  return resolvedMessages
}
