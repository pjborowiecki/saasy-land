"use client"

import { adminClient, anonymousClient, inferAdditionalFields, multiSessionClient, twoFactorClient } from "better-auth/client/plugins"
import { createAuthClient } from "better-auth/react"

import { env } from "~/src/environment"

import { CONSTANTS } from "~/src/constants"

import type { auth } from "~/src/integrations/better-auth/auth._server"
import { ac, ROLES_CONFIG } from "~/src/integrations/better-auth/auth.permissions"
import { localePathPrefixes } from "~/src/integrations/next-intl/i18n.routing"

function getLocaleAwarePath(path: string): string {
  if (globalThis.location === undefined) {
    return path
  }

  const pathname = globalThis.location.pathname ?? ""

  for (const prefix of Object.values(localePathPrefixes)) {
    if (pathname === prefix || pathname.startsWith(`${prefix}/`)) {
      return `${prefix}${path}`
    }
  }

  return path
}

export const authClient = createAuthClient({
  baseURL: env.NEXT_PUBLIC_APP_URL,
  plugins: [
    adminClient({ ac, roles: ROLES_CONFIG }),
    anonymousClient(),
    inferAdditionalFields<typeof auth>(),
    multiSessionClient(),
    twoFactorClient({
      onTwoFactorRedirect() {
        globalThis.location.href = getLocaleAwarePath(CONSTANTS.ROUTES.TWO_FACTOR)
      },
    }),
  ],
})

export const { getSession, requestPasswordReset, resetPassword, sendVerificationEmail, signIn, signOut, signUp, useSession, verifyEmail } =
  authClient

export const { twoFactor } = authClient
