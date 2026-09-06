import { type MessageFormatElement, parse } from "@formatjs/icu-messageformat-parser"
import { readdirSync, readFileSync } from "node:fs"
import { join } from "node:path"

import { I18N } from "../src/integrations/use-intl/i18n.config"

const root = join(import.meta.dirname, "../messages")
const problems: string[] = []
const flatten = (node: Record<string, unknown>, prefix = ""): [string, string][] =>
  Object.entries(node).flatMap(([key, value]) => {
    const path = prefix ? `${prefix}.${key}` : key
    return typeof value === "string" ? [[path, value]] : flatten(value as Record<string, unknown>, path)
  })
const argumentsOf = (nodes: MessageFormatElement[], result = new Set<string>()): string[] => {
  for (const node of nodes) {
    if (node.type !== 0 && node.type !== 7) result.add(`${node.type}:${node.value}`)
    if (node.type === 5 || node.type === 6) {
      for (const option of Object.values(node.options)) argumentsOf(option.value, result)
    }
    if (node.type === 8) argumentsOf(node.children, result)
  }
  return [...result].toSorted()
}
for (const file of readdirSync(join(root, I18N.DEFAULT_LOCALE)).filter((name) => name.endsWith(".json"))) {
  const source = new Map(flatten(JSON.parse(readFileSync(join(root, I18N.DEFAULT_LOCALE, file), "utf8")) as Record<string, unknown>))
  for (const locale of I18N.SUPPORTED_LOCALES) {
    const messages = flatten(JSON.parse(readFileSync(join(root, locale, file), "utf8")) as Record<string, unknown>)
    for (const [key, value] of messages) {
      try {
        const original = source.get(key) ?? ""
        const expected = argumentsOf(parse(original))
        const actual = argumentsOf(parse(value))
        if (JSON.stringify(expected) !== JSON.stringify(actual)) problems.push(`${locale}/${file}:${key}: changed ICU arguments or tags`)
        if (value.includes("```") && !original.includes("```")) problems.push(`${locale}/${file}:${key}: unexpected Markdown code fence`)
        if (locale !== I18N.DEFAULT_LOCALE && value === original && (value.match(/\p{L}+/gu)?.length ?? 0) >= 5) {
          problems.push(`${locale}/${file}:${key}: untranslated English text`)
        }
        if (/please provide the (?:english |source )?text|I am ready when you are|here is the translation/iu.test(value)) {
          problems.push(`${locale}/${file}:${key}: translation instructions in visible copy`)
        }
        if (/ZXQ\d+QXZ|<ph\d+|▁|\{"translation":/u.test(value)) problems.push(`${locale}/${file}:${key}: unresolved translation marker`)
      } catch (error) {
        problems.push(`${locale}/${file}:${key}: ${String(error)}`)
      }
    }
  }
}
if (problems.length > 0) {
  console.error(problems.join("\n"))
  process.exit(1)
}
console.log("Every translated message parses and preserves its ICU arguments and rich-text tags.")
