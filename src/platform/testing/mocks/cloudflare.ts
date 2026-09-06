import { readFileSync, readdirSync } from "node:fs"
import { resolve } from "node:path"
import { DatabaseSync, type SQLInputValue } from "node:sqlite"

const database = new DatabaseSync(":memory:")
const migrations = resolve("src/integrations/drizzle-orm/migrations")
for (const file of readdirSync(migrations)
  .filter((name) => name.endsWith(".sql"))
  .toSorted()) {
  database.exec(readFileSync(resolve(migrations, file), "utf8"))
}

const prepare = (query: string, values: SQLInputValue[] = []) => ({
  async all() {
    const results = database.prepare(query).all(...values)
    return { meta: {}, results, success: true }
  },
  bind: (...parameters: SQLInputValue[]) => prepare(query, parameters),
  async first(column?: string) {
    const row = database.prepare(query).get(...values)
    return column === undefined ? (row ?? null) : (row?.[column] ?? null)
  },
  async raw() {
    const statement = database.prepare(query)
    statement.setReturnArrays(true)
    return statement.all(...values)
  },
  async run() {
    const result = database.prepare(query).run(...values)
    return { meta: { changes: result.changes, last_row_id: result.lastInsertRowid }, results: [], success: true }
  },
})

const cache = new Map<string, string>()
export const resetTestBindings = (): void => {
  cache.clear()
}
// The harness supplies only the bindings exercised by local tests.
// oxlint-disable-next-line typescript/no-unsafe-type-assertion
export const env = {
  ...process.env,
  ASSETS: { fetch: async () => new Response("Not found", { status: 404 }) },
  CACHE: {
    delete: async (key: string) => {
      cache.delete(key)
    },
    get: async (key: string, type?: string) => {
      const value = cache.get(key)
      if (value === undefined) {
        return null
      }
      const decoded: unknown = type === "json" ? JSON.parse(value) : value
      return decoded
    },
    put: async (key: string, value: string) => {
      cache.set(key, value)
    },
  },
  DB: { batch: (statements: ReturnType<typeof prepare>[]) => Promise.all(statements.map((statement) => statement.all())), prepare },
} as unknown as Cloudflare.Env

export const waitUntil = (promise: Promise<unknown>): void => {
  void promise
}
