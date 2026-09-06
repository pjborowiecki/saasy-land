import { YAML } from "bun"
import { existsSync, readdirSync, readFileSync } from "node:fs"
import { join, relative } from "node:path"

import { I18N } from "../src/integrations/use-intl/i18n.config"

const root = join(import.meta.dirname, "../content")
const sourceSuffix = `.${I18N.DEFAULT_LOCALE}.mdx`
const metaSuffix = `.${I18N.DEFAULT_LOCALE}.json`
const problems: string[] = []
const files = (directory: string): string[] =>
  readdirSync(directory, { withFileTypes: true }).flatMap((entry) =>
    entry.isDirectory() ? files(join(directory, entry.name)) : [join(directory, entry.name)],
  )

const codeBlocks = (source: string): string[] => [...source.matchAll(/^(`{3,}|~{3,})[^\n]*\n[\s\S]*?^\1\s*$/gmu)].map(([code]) => code).filter((code) => !code.startsWith("```markdown")).map((code) => code.replace(/^\s*\/\/[^\n]*$/gmu, ""))
const frontmatter = (source: string): Record<string, unknown> => {
  const match = /^---\r?\n(?<yaml>[\s\S]*?)\r?\n---/u.exec(source)
  if (!match?.groups?.["yaml"]) throw new Error("Missing MDX frontmatter")
  return YAML.parse(match.groups["yaml"]) as Record<string, unknown>
}

const isEnglishProse = (text: string): boolean =>
  (text.match(/\p{L}+/gu)?.length ?? 0) >= 7 && /\b(?:the|your|you|this|that|with|from|for|and|will|our|how)\b/iu.test(text)

const proseParagraphs = (source: string): string[] =>
  source
    .replace(/^---\r?\n[\s\S]*?\r?\n---/u, "")
    .replace(/^(`{3,}|~{3,})[^\n]*\n[\s\S]*?^\1\s*$/gmu, "")
    .split(/\n\s*\n/u)
    .map((paragraph) => paragraph.trim().replace(/\s+/gu, " "))
    .filter((paragraph) => !/^(?:import |export |<)/u.test(paragraph) && isEnglishProse(paragraph))

for (const sourcePath of files(root).filter((path) => path.endsWith(sourceSuffix) || path.endsWith(metaSuffix))) {
  const isMdx = sourcePath.endsWith(sourceSuffix)
  const suffix = isMdx ? sourceSuffix : metaSuffix
  const source = readFileSync(sourcePath, "utf8")
  for (const locale of I18N.SUPPORTED_LOCALES) {
    const targetPath = sourcePath.slice(0, -suffix.length) + `.${locale}.${isMdx ? "mdx" : "json"}`
    const label = relative(root, targetPath)
    if (!existsSync(targetPath)) {
      problems.push(`Missing ${label}`)
      continue
    }
    const target = readFileSync(targetPath, "utf8")
    if (isMdx) {
      const metadata = frontmatter(target)
      if (typeof metadata["title"] !== "string" || metadata["title"].trim().length === 0) problems.push(`Missing title in ${label}`)
      if (JSON.stringify(codeBlocks(source)) !== JSON.stringify(codeBlocks(target))) problems.push(`Changed code examples in ${label}`)
      if (/ZXQ\d+QXZ|<ph\d+|▁|\{"translation":/u.test(target)) problems.push(`Unresolved translation marker in ${label}`)
      if (locale !== I18N.DEFAULT_LOCALE) {
        const translatedParagraphs = new Set(proseParagraphs(target))
        if (proseParagraphs(source).some((paragraph) => translatedParagraphs.has(paragraph))) {
          problems.push(`Untranslated English paragraph in ${label}`)
        }
        const originalMetadata = frontmatter(source)
        for (const field of ["title", "description", "excerpt"]) {
          const original = originalMetadata[field]
          if (typeof original === "string" && isEnglishProse(original) && metadata[field] === original) {
            problems.push(`Untranslated ${field} in ${label}`)
          }
        }
      }
    } else {
      const sourceMetadata = JSON.parse(source) as { pages?: string[] }
      const targetMetadata = JSON.parse(target) as { pages?: string[] }
      if (JSON.stringify(sourceMetadata.pages) !== JSON.stringify(targetMetadata.pages)) problems.push(`Changed navigation slugs in ${label}`)
    }
  }
}

if (problems.length > 0) {
  console.error(problems.join("\n"))
  process.exit(1)
}
console.log(`Content files, navigation, and code examples match across ${I18N.SUPPORTED_LOCALES.length} locales.`)
