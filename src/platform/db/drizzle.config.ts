import { defineConfig } from "drizzle-kit"

import { env } from "~/src/platform/env"

export default defineConfig({
  dbCredentials: { url: env.DATABASE_URL },
  dialect: "postgresql",
  migrations: {
    prefix: "timestamp",
    schema: "public",
    table: "__drizzle_migrations__",
  },
  out: "./src/platform/db/migrations",
  schema: "./src/platform/db/schema.ts",
  strict: true,
  verbose: true,
})
