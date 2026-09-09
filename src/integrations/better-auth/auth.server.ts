import "@tanstack/react-start/server-only"

import { env } from "cloudflare:workers"

import { checkout, polar as polarPlugin, portal, webhooks } from "@polar-sh/better-auth"
import { betterAuth } from "better-auth"
import { drizzleAdapter } from "better-auth/adapters/drizzle"
import { admin } from "better-auth/plugins/admin"
import { multiSession } from "better-auth/plugins/multi-session"
import { twoFactor } from "better-auth/plugins/two-factor"
import { tanstackStartCookies } from "better-auth/tanstack-start"
import { v7 } from "uuid"

import { DEFAULT_ROLE_CODE, ROLES, ROLE_CODES, ac } from "~/src/integrations/better-auth/auth.access"
import { PASSWORD_MAX_LENGTH, PASSWORD_MIN_LENGTH } from "~/src/integrations/better-auth/auth.constraints"
import { authEmailHandlers } from "~/src/integrations/better-auth/auth.emails"
import { db } from "~/src/integrations/drizzle-orm/drizzle.database"
import * as schema from "~/src/integrations/drizzle-orm/drizzle.schemas"
import { polar } from "~/src/integrations/polar/polar.config"

import { LICENSE_TIER } from "~/src/modules/license/license.constants"
import { licenseWebhookHandlers } from "~/src/modules/license/license.webhooks"

import { APP_NAME } from "~/src/presentation/branding"
import { ROUTES } from "~/src/routes"

const APP_HOSTS = ["localhost:3000", "127.0.0.1:3000", "saasyland.com", "*.saasyland.com", "*.pjborowiecki.workers.dev"]

const COOKIE_CACHE_MAX_AGE_IN_SECONDS = 300
const MAX_CONCURRENT_SESSIONS = 10

const TRUSTED_AUTH_PROVIDERS = ["github", "google"]
export const TRUSTED_IP_HEADERS = ["CF-Connecting-IP", "x-forwarded-for"] as const

export const auth = betterAuth({
  account: {
    accountLinking: { enabled: true, trustedProviders: TRUSTED_AUTH_PROVIDERS },
    encryptOAuthTokens: true,
  },
  advanced: {
    database: { generateId: () => v7() },
    ipAddress: { ipAddressHeaders: [...TRUSTED_IP_HEADERS] },
  },
  appName: APP_NAME,
  baseURL: { allowedHosts: APP_HOSTS },
  database: drizzleAdapter(db, { provider: "sqlite", schema }),
  emailAndPassword: {
    enabled: true,
    maxPasswordLength: PASSWORD_MAX_LENGTH,
    minPasswordLength: PASSWORD_MIN_LENGTH,
    onExistingUserSignUp: authEmailHandlers.sendExistingUserVerificationEmail,
    requireEmailVerification: true,
    revokeSessionsOnPasswordReset: true,
    sendResetPassword: authEmailHandlers.sendResetPasswordEmail,
  },
  emailVerification: {
    autoSignInAfterVerification: true,
    sendOnSignUp: true,
    sendVerificationEmail: authEmailHandlers.sendVerificationEmail,
  },
  experimental: { joins: true },
  plugins: [
    admin({
      ac,
      adminRoles: [ROLE_CODES.ADMIN],
      defaultRole: DEFAULT_ROLE_CODE,
      roles: ROLES,
    }),
    multiSession({ maximumSessions: MAX_CONCURRENT_SESSIONS }),
    polarPlugin({
      client: polar,
      use: [
        checkout({
          authenticatedUsersOnly: true,
          products: [
            { productId: env.POLAR_PRODUCT_ID_CORE, slug: LICENSE_TIER.CORE },
            { productId: env.POLAR_PRODUCT_ID_COMPLETE, slug: LICENSE_TIER.COMPLETE },
            { productId: env.POLAR_PRODUCT_ID_AGENCY, slug: LICENSE_TIER.AGENCY },
          ],
          successUrl: ROUTES.APP,
        }),
        portal(),
        webhooks({ ...licenseWebhookHandlers, secret: env.POLAR_WEBHOOK_SECRET }),
      ],
    }),
    twoFactor({ issuer: APP_NAME }),
    tanstackStartCookies(),
  ],
  secret: env.AUTH_SECRET,
  session: {
    cookieCache: { enabled: true, maxAge: COOKIE_CACHE_MAX_AGE_IN_SECONDS, version: "2" },
    storeSessionInDatabase: true,
  },
  socialProviders: {
    github: { clientId: env.AUTH_GITHUB_CLIENT_ID, clientSecret: env.AUTH_GITHUB_CLIENT_SECRET },
    google: { clientId: env.AUTH_GOOGLE_CLIENT_ID, clientSecret: env.AUTH_GOOGLE_CLIENT_SECRET },
  },
  telemetry: { enabled: false },
  user: {
    additionalFields: {
      timezone: { input: true, required: false, type: "string" },
    },
    changeEmail: {
      enabled: true,
      sendChangeEmailConfirmation: authEmailHandlers.sendChangeEmailConfirmationEmail,
    },
  },
  verification: { storeIdentifier: "hashed", storeInDatabase: true },
})
