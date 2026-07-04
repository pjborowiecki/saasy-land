import "server-only"

import { waitUntil } from "@vercel/functions"
import { IP_HEADER_NAME } from "@vercel/functions/headers"
import { betterAuth } from "better-auth"
import { drizzleAdapter } from "better-auth/adapters/drizzle"
import { nextCookies } from "better-auth/next-js"
import { admin, anonymous, multiSession, twoFactor } from "better-auth/plugins"
import { randomUUIDv7 } from "bun"

import { env } from "~/src/environment"

import { CONSTANTS } from "~/src/constants"

import { ADMIN_PANEL_ROLES } from "~/src/integrations/better-auth/auth.access"
import { authEmailHandlers } from "~/src/integrations/better-auth/auth.emails"
import { ac, ROLES_CONFIG } from "~/src/integrations/better-auth/auth.permissions"
import { db } from "~/src/integrations/drizzle-orm/drizzle.database"
import * as schema from "~/src/integrations/drizzle-orm/drizzle.schemas"
import { redis } from "~/src/integrations/redis/redis.config"

const MAX_SIGNUP_ATTEMPTS = 3
const MAX_SIGNIN_ATTEMPTS = 5
const MAX_FORGET_PASSWORD_ATTEMPTS = 3
const MAX_RESET_PASSWORD_ATTEMPTS = 5

const RATE_LIMIT_MAX_REQUESTS = 100
const RATE_LIMIT_WINDOW_IN_SECONDS = 60

const COOKIE_CACHE_MAX_AGE_IN_SECONDS = 300
const MAX_CONCURRENT_SESSIONS = 10

const TRUSTED_AUTH_PROVIDERS = ["github", "google"]
const TRUSTED_IP_HEADERS = [IP_HEADER_NAME, "x-forwarded-for"]

export const auth = betterAuth({
  account: { accountLinking: { enabled: true, trustedProviders: TRUSTED_AUTH_PROVIDERS } },
  advanced: {
    backgroundTasks: { handler: waitUntil },
    database: { generateId: () => randomUUIDv7() },
    ipAddress: { ipAddressHeaders: [...TRUSTED_IP_HEADERS] },
  },
  appName: CONSTANTS.APP_NAME,
  baseURL: env.NEXT_PUBLIC_APP_URL,
  database: drizzleAdapter(db, { provider: "pg", schema }),
  emailAndPassword: { enabled: true, requireEmailVerification: true, sendResetPassword: authEmailHandlers.sendResetPasswordEmail },
  emailVerification: {
    autoSignInAfterVerification: true,
    sendOnSignUp: true,
    sendVerificationEmail: authEmailHandlers.sendVerificationEmail,
  },
  experimental: { joins: true },
  plugins: [
    admin({
      ac,
      adminRoles: [...ADMIN_PANEL_ROLES],
      defaultRole: CONSTANTS.PERMISSIONS.DEFAULT_ROLE,
      roles: ROLES_CONFIG,
    }),
    anonymous(),
    multiSession({ maximumSessions: MAX_CONCURRENT_SESSIONS }),
    twoFactor({ issuer: CONSTANTS.APP_NAME }),
    nextCookies(),
  ],
  rateLimit: {
    customRules: {
      [CONSTANTS.ROUTES.API_AUTH.REQUEST_PASSWORD_RESET]: {
        max: MAX_FORGET_PASSWORD_ATTEMPTS,
        window: RATE_LIMIT_WINDOW_IN_SECONDS,
      },
      [CONSTANTS.ROUTES.API_AUTH.RESET_PASSWORD]: {
        max: MAX_RESET_PASSWORD_ATTEMPTS,
        window: RATE_LIMIT_WINDOW_IN_SECONDS,
      },
      [CONSTANTS.ROUTES.API_AUTH.SIGN_IN_EMAIL]: {
        max: MAX_SIGNIN_ATTEMPTS,
        window: RATE_LIMIT_WINDOW_IN_SECONDS,
      },
      [CONSTANTS.ROUTES.API_AUTH.SIGN_UP_EMAIL]: {
        max: MAX_SIGNUP_ATTEMPTS,
        window: RATE_LIMIT_WINDOW_IN_SECONDS,
      },
    },
    enabled: true,
    max: RATE_LIMIT_MAX_REQUESTS,
    storage: "secondary-storage",
    window: RATE_LIMIT_WINDOW_IN_SECONDS,
  },
  secondaryStorage: {
    delete: async (key) => {
      await redis.del(key)
    },
    get: async (key) => {
      return await redis.get<string>(key)
    },
    getAndDelete: async (key) => {
      return await redis.getdel<string>(key)
    },
    increment: async (key, ttl) => {
      const count = await redis.incr(key)
      if (count === 1 && ttl !== undefined && ttl > 0) {
        await redis.expire(key, ttl)
      }
      return count
    },
    set: async (key, value, ttl) => {
      if (ttl === undefined || ttl <= 0) {
        if (ttl !== undefined && ttl <= 0) await redis.del(key)
        return
      }
      await redis.set(key, value, { ex: ttl })
    },
  },
  secret: env.AUTH_SECRET,
  session: {
    cookieCache: { enabled: true, maxAge: COOKIE_CACHE_MAX_AGE_IN_SECONDS },
    storeSessionInDatabase: true,
  },
  socialProviders: {
    github: { clientId: env.GITHUB_CLIENT_ID, clientSecret: env.GITHUB_CLIENT_SECRET },
    google: { clientId: env.GOOGLE_CLIENT_ID, clientSecret: env.GOOGLE_CLIENT_SECRET },
  },
  telemetry: { enabled: false },
  trustedOrigins: [env.NEXT_PUBLIC_APP_URL],
  user: {
    additionalFields: {
      timezone: { input: true, required: false, type: "string" },
    },
    changeEmail: {
      enabled: true,
      sendChangeEmailConfirmation: authEmailHandlers.sendChangeEmailConfirmationEmail,
    },
  },
})
