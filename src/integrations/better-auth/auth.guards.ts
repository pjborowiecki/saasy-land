import "server-only"

import { headers } from "next/headers"
import { cache } from "react"

import { getLocale } from "next-intl/server"

import { CONSTANTS } from "~/src/constants"

import { auth } from "~/src/integrations/better-auth/auth._server"
import { getPostAuthRedirect, hasAdminAccess } from "~/src/integrations/better-auth/auth.access"
import { redirect } from "~/src/integrations/next-intl/i18n.navigation"

export const getCurrentSession = cache(async () =>
  auth.api.getSession({
    headers: await headers(),
  }),
)

export async function requireAdminPanel() {
  const locale = await getLocale()
  const session = await getCurrentSession()

  if (!session || !hasAdminAccess(session.user.role)) {
    redirect({
      href: session ? getPostAuthRedirect(session.user.role) : CONSTANTS.ROUTES.SIGN_IN,
      locale,
    })
  }

  return session
}
