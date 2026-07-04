import "server-only"

import { getLocale } from "next-intl/server"

import { CONSTANTS } from "~/src/constants"

import { getPostAuthRedirect, hasAdminAccess } from "~/src/integrations/better-auth/auth.access"
import { getCurrentSession } from "~/src/integrations/better-auth/auth.utils"
import { redirect } from "~/src/integrations/next-intl/i18n.navigation"

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
