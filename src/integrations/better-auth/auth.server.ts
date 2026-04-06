import { waitUntil } from "@vercel/functions"
import { betterAuth } from "better-auth"
import { drizzleAdapter } from "better-auth/adapters/drizzle"
import { nextCookies } from "better-auth/next-js"
import { randomUUIDv7 } from "bun"

import { env } from "~/src/environment"
import { db } from "~/src/integrations/drizzle-orm/drizzle.database"
import * as schema from "~/src/integrations/drizzle-orm/drizzle.schemas"

export const auth = betterAuth({
  secret: env.AUTH_SECRET,
  baseURL: env.NEXT_PUBLIC_APP_URL,
  database: drizzleAdapter(db, { provider: "pg", schema }),
  advanced: {
    backgroundTasks: { handler: waitUntil },
    database: { generateId: () => randomUUIDv7() },
  },
  experimental: { joins: true },
  plugins: [nextCookies()],
})
