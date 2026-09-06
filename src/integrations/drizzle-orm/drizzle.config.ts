import { defineConfig } from "drizzle-kit"

export default defineConfig({
  dbCredentials: {
    accountId: globalThis.process.env.CLOUDFLARE_ACCOUNT_ID,
    databaseId: globalThis.process.env.CLOUDFLARE_DATABASE_ID,
    token: globalThis.process.env.CLOUDFLARE_ACCESS_TOKEN,
  },
  dialect: "sqlite",
  driver: "d1-http",
  migrations: {
    prefix: "timestamp",
  },
  out: "./src/integrations/drizzle-orm/migrations",
  schema: "./src/integrations/drizzle-orm/drizzle.schemas.ts",
  strict: true,
  verbose: true,
})
