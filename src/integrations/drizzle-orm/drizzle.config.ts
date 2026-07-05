import { defineConfig } from "drizzle-kit"

import { env } from "~/src/environment"

export default defineConfig({
  dbCredentials: { url: env.DATABASE_URL },
  dialect: "postgresql",
  migrations: {
    prefix: "timestamp",
    schema: "public",
    table: "__drizzle_migrations__",
  },
  out: "./src/integrations/drizzle-orm/migrations",
  schema: "./src/integrations/drizzle-orm/drizzle.schemas.ts",
  strict: true,
  verbose: true,
})
