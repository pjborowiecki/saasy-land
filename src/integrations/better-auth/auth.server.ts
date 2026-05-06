import { waitUntil } from "@vercel/functions"
import { betterAuth } from "better-auth"
import { drizzleAdapter } from "better-auth/adapters/drizzle"
import { nextCookies } from "better-auth/next-js"
import { randomUUIDv7 } from "bun"

import { env } from "~/src/environment"

import { CONSTANTS } from "~/src/constants"

import { db } from "~/src/integrations/drizzle-orm/drizzle.database"
import * as schema from "~/src/integrations/drizzle-orm/drizzle.schemas"

export const auth = betterAuth({
  appName: CONSTANTS.APP_NAME,
  secret: env.AUTH_SECRET,
  baseURL: env.NEXT_PUBLIC_APP_URL,
  trustedOrigins: [env.NEXT_PUBLIC_APP_URL],
  database: drizzleAdapter(db, { provider: "pg", schema }),
  emailAndPassword: { enabled: true },
  socialProviders: {
    google: { clientId: env.GOOGLE_CLIENT_ID, clientSecret: env.GOOGLE_CLIENT_SECRET },
    github: { clientId: env.GITHUB_CLIENT_ID, clientSecret: env.GITHUB_CLIENT_SECRET },
  },
  account: { accountLinking: { enabled: true, trustedProviders: ["google", "github"] } },
  session: { cookieCache: { enabled: true, maxAge: 5 * 60 } },
  advanced: { backgroundTasks: { handler: waitUntil }, database: { generateId: () => randomUUIDv7() } },
  experimental: { joins: true },
  telemetry: { enabled: false },
  plugins: [nextCookies()],
})
