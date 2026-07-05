"use client"

import { adminClient, anonymousClient, inferAdditionalFields, multiSessionClient, twoFactorClient } from "better-auth/client/plugins"
import { createAuthClient } from "better-auth/react"

import { env } from "~/src/environment"

import { CONSTANTS } from "~/src/constants"

import type { auth } from "~/src/integrations/better-auth/auth._server"
import { ac, ROLES_CONFIG } from "~/src/integrations/better-auth/auth.permissions"

export const authClient = createAuthClient({
  baseURL: env.NEXT_PUBLIC_APP_URL,
  plugins: [
    adminClient({ ac, roles: ROLES_CONFIG }),
    anonymousClient(),
    inferAdditionalFields<typeof auth>(),
    multiSessionClient(),
    twoFactorClient({
      onTwoFactorRedirect() {
        globalThis.location.href = CONSTANTS.ROUTES.TWO_FACTOR
      },
    }),
  ],
})

export const { getSession, requestPasswordReset, resetPassword, signIn, signOut, signUp, useSession } = authClient
