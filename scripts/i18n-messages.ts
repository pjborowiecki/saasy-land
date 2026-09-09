import { readdirSync, readFileSync } from "node:fs"
import { join } from "node:path"
import type { AbstractIntlMessages } from "use-intl"

type MessageTree = Record<string, unknown>

const MESSAGES_DIR = join(import.meta.dirname, "../messages")
const LAST_SEGMENT_OFFSET = 1

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

function deepMergeMessages(target: MessageTree, source: MessageTree): MessageTree {
  const merged: MessageTree = { ...target }

  for (const [key, value] of Object.entries(source)) {
    const existing = merged[key]
    merged[key] = isPlainObject(existing) && isPlainObject(value) ? deepMergeMessages(existing, value) : value
  }

  return merged
}

/** Mutating insert: walks the dotted-filename path once instead of cloning the whole tree per file. */
function insertMessageFile(tree: MessageTree, filename: string, content: MessageTree): void {
  const segments = filename
    .replace(/\.json$/u, "")
    .split(".")
    .filter((segment) => segment.length > 0)
  let node = tree
  for (const [index, segment] of segments.entries()) {
    const existing = node[segment]

    if (index === segments.length - LAST_SEGMENT_OFFSET) {
      node[segment] = isPlainObject(existing) ? deepMergeMessages(existing, content) : content
      return
    }

    if (isPlainObject(existing)) {
      node = existing
    } else {
      const branch: MessageTree = {}
      node[segment] = branch
      node = branch
    }
  }
}

export function loadLocaleMessages(locale: string): AbstractIntlMessages {
  const localeDir = join(MESSAGES_DIR, locale)
  const files = readdirSync(localeDir)
    .filter((file) => file.endsWith(".json"))
    .toSorted((a, b) => a.localeCompare(b))

  const messages: MessageTree = {}

  for (const file of files) {
    const filePath = join(localeDir, file)
    const parsed: unknown = JSON.parse(readFileSync(filePath, "utf8"))
    insertMessageFile(messages, file, parseMessageTree(parsed, filePath))
  }

  if (!isIntlMessages(messages)) {
    throw new Error(`Invalid merged messages for locale "${locale}"`)
  }
  return messages
}
