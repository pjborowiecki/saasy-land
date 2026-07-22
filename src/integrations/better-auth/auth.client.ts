"use client"

import { adminClient, anonymousClient, inferAdditionalFields, multiSessionClient, twoFactorClient } from "better-auth/client/plugins"
import { createAuthClient } from "better-auth/react"

import { env } from "~/src/platform/env"

import { ac, ROLES_CONFIG } from "~/src/integrations/better-auth/auth.access"
import type { auth } from "~/src/integrations/better-auth/auth.server"
import { redirectPathname } from "~/src/integrations/next-intl/i18n.locale"

import { ROUTES } from "~/src/routes"

export const authClient = createAuthClient({
  baseURL: env.NEXT_PUBLIC_APP_URL,
  plugins: [
    adminClient({ ac, roles: ROLES_CONFIG }),
    anonymousClient(),
    inferAdditionalFields<typeof auth>(),
    multiSessionClient(),
    twoFactorClient({
      onTwoFactorRedirect() {
        globalThis.location.href = redirectPathname(globalThis.location?.pathname ?? "", ROUTES.TWO_FACTOR)
      },
    }),
  ],
})

export const { getSession, requestPasswordReset, resetPassword, sendVerificationEmail, signIn, signOut, signUp, useSession, verifyEmail } =
  authClient

export const { twoFactor } = authClient
