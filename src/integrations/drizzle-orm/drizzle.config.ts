import { defineConfig } from "drizzle-kit"

import { env } from "~/src/environment"

export default defineConfig({
  dialect: "postgresql",
  schema: "./src/integrations/drizzle-orm/drizzle.schemas.ts",
  out: "./src/integrations/drizzle-orm/migrations",
  dbCredentials: { url: env.DATABASE_URL },
  strict: true,
  verbose: true,
  migrations: {
    prefix: "timestamp",
    table: "__drizzle_migrations__",
    schema: "public",
  },
})
