import { existsSync, readFileSync } from "node:fs"
import { resolve } from "node:path"
import { expect, it } from "vite-plus/test"
it("serves the original Geist font files locally with both CSS variables", () => {
  const css = readFileSync(resolve("src/presentation/styles/fonts.css"), "utf8")
  expect(css).toContain("--font-geist-sans")
  expect(css).toContain("--font-geist-mono")
  for (const match of css.matchAll(/url\("?(?<font>\/fonts\/[^")]+)"?\)/gu)) {
    expect(existsSync(resolve(`public${match.groups?.["font"]}`))).toBe(true)
  }
  expect(css).toContain("font-display: swap")
})
