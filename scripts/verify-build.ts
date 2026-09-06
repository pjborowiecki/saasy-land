import { existsSync } from "node:fs"
import { access, readdir, readFile } from "node:fs/promises"
import { dirname, join, resolve } from "node:path"

import { I18N } from "../src/integrations/use-intl/i18n.config"
import { localizePathname } from "../src/integrations/use-intl/i18n.paths"

const configPath = ".wrangler/deploy/config.json"
const deployment = JSON.parse(await readFile(configPath, "utf8")) as { configPath: string }
await access(resolve(dirname(configPath), deployment.configPath))
await access("dist/client/index.html")
for (const locale of I18N.SUPPORTED_LOCALES) {
  for (const pathname of ["/", "/privacy", "/terms", "/refunds", "/licence"]) {
    const localized = localizePathname({ locale, pathname })
    const html = await readFile(`dist/client${localized === "/" ? "" : localized}/index.html`, "utf8")
    if (!new RegExp(`<html\\b[^>]*\\blang="${locale}"`, "u").test(html)) throw new Error(`Incorrect document language: ${localized}`)
    const links = [...html.matchAll(/<link\b[^>]*>/gu)].map(([tag]) => tag)
    const canonical = links.filter((tag) => /\brel="canonical"/u.test(tag))
    const alternates = links.filter((tag) => /\brel="alternate"/u.test(tag) && /\bhref[Ll]ang=/u.test(tag))
    if (canonical.length !== 1 || alternates.length !== I18N.SUPPORTED_LOCALES.length + 1) {
      throw new Error(`Missing or duplicate localized SEO links: ${localized}`)
    }
    const href = /\bhref="(?<url>[^"]+)"/u.exec(canonical[0] ?? "")?.groups?.["url"]
    if (!href || new URL(href).pathname !== localized) throw new Error(`Incorrect canonical URL: ${localized}`)
  }
}
await access("dist/client/fonts")
for (const path of [...I18N.SUPPORTED_LOCALES.map((locale) => locale.split("-")[0]), I18N.DEFAULT_LOCALE, "admin", "app", "auth/sign-in"]) {
  if (existsSync(`dist/client/${path}/index.html`)) throw new Error(`Unexpected prerendered alias or protected page: ${path}`)
}
const clientAssets = await readdir("dist/client/assets")
if (!clientAssets.some((name) => name.endsWith(".js"))) throw new Error("Missing client JavaScript")
const scanner = new Bun.Transpiler({ loader: "js" })
for (const file of clientAssets.filter((name) => name.endsWith(".js"))) {
  const source = await readFile(join("dist/client/assets", file), "utf8")
  const { imports } = scanner.scan(source)
  if (imports.some(({ path: specifier }) => specifier === "cloudflare:workers" || specifier.startsWith("next/"))) {
    throw new Error(`Server-only or obsolete framework code in client asset: ${file}`)
  }
}
process.stdout.write("Verified Worker deployment config, prerendered locales, fonts, and client assets.\n")
