#!/usr/bin/env bun

import { readFileSync } from "node:fs"
import { join } from "node:path"
import { $ } from "bun"

import { I18N } from "../src/constants/_constants/i18n"

const MESSAGES_DIR = join(import.meta.dir, "../src/integrations/next-intl/messages")
const SOURCE_LOCALE = I18N.DEFAULT_LOCALE

function compareAlphabetically(a: string, b: string): number {
  return a.localeCompare(b)
}

function flattenMessageKeys(value: unknown, prefix = ""): string[] {
  if (value === null || typeof value !== "object" || Array.isArray(value)) {
    return prefix.length > 0 ? [prefix] : []
  }

  return Object.entries(value as Record<string, unknown>).flatMap(([key, nested]) => {
    const path = prefix.length > 0 ? `${prefix}.${key}` : key

    if (nested !== null && typeof nested === "object" && !Array.isArray(nested)) {
      return flattenMessageKeys(nested, path)
    }

    return [path]
  })
}

function loadLocaleKeys(locale: string): Set<string> {
  const filePath = join(MESSAGES_DIR, `${locale}.json`)
  const json = JSON.parse(readFileSync(filePath, "utf8")) as unknown
  return new Set(flattenMessageKeys(json))
}

function checkLocaleParity(): boolean {
  const sourceKeys = loadLocaleKeys(SOURCE_LOCALE)
  const problems: string[] = []

  for (const locale of I18N.LOCALES) {
    if (locale === SOURCE_LOCALE) {
      continue
    }

    const localeKeys = loadLocaleKeys(locale)
    const missing = [...sourceKeys].filter((key) => !localeKeys.has(key)).toSorted(compareAlphabetically)
    const extra = [...localeKeys].filter((key) => !sourceKeys.has(key)).toSorted(compareAlphabetically)

    if (missing.length === 0 && extra.length === 0) {
      continue
    }

    problems.push(`Locale "${locale}" is out of sync with "${SOURCE_LOCALE}":`)

    for (const key of missing) {
      problems.push(`  missing: ${key}`)
    }

    for (const key of extra) {
      problems.push(`  extra: ${key}`)
    }
  }

  if (problems.length === 0) {
    process.stdout.write(`✅ Translation keys are in sync across ${I18N.LOCALES.join(", ")}.\n`)
    return true
  }

  process.stderr.write("\n❌ Translation locale parity check failed.\n\n")
  process.stderr.write(`${problems.join("\n")}\n\n`)
  process.stderr.write(`Update ${MESSAGES_DIR} so every locale matches ${SOURCE_LOCALE}.json keys exactly.\n\n`)
  return false
}

async function checkInvalidMessages(): Promise<boolean> {
  const result = await $`bunx --bun @lingual/i18n-check -l ${MESSAGES_DIR} -s ${SOURCE_LOCALE} -f next-intl -o invalidKeys`.quiet()

  if (result.exitCode === 0) {
    process.stdout.write("✅ Translation message syntax is valid in all locale files.\n")
    return true
  }

  process.stderr.write("\n❌ Invalid translation messages detected.\n\n")
  process.stderr.write(result.stderr.toString())
  process.stderr.write(result.stdout.toString())
  return false
}

async function run(): Promise<void> {
  const parityOk = checkLocaleParity()
  const invalidOk = await checkInvalidMessages()

  if (!parityOk || !invalidOk) {
    process.exit(1)
  }
}

await run()
