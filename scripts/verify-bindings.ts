import { readJsonc } from "./jsonc.ts"

const environment = process.argv[2]
if (environment !== "preview" && environment !== "production") throw new Error("Expected preview or production")
const config = (await readJsonc("wrangler.jsonc")) as {
  env: Record<string, { d1_databases: { database_id: string }[]; kv_namespaces: { id: string }[] }>
}
const bindings = config.env[environment]
if (
  !bindings ||
  [...bindings.d1_databases.map((entry) => entry.database_id), ...bindings.kv_namespaces.map((entry) => entry.id)].some((id) =>
    /^[0-]+$/u.test(id),
  )
) {
  throw new Error(`Provision D1 and KV for ${environment}, then replace their placeholder IDs in wrangler.jsonc. See README.md.`)
}
