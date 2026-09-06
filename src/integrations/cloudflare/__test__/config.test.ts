import { parse } from "jsonc-parser"
import { readFileSync } from "node:fs"
import { expect, it } from "vite-plus/test"

it("delegates request observability to Cloudflare", () => {
  const config: unknown = parse(readFileSync("wrangler.jsonc", "utf8"))
  expect(config).toHaveProperty("observability.enabled", true)
})
