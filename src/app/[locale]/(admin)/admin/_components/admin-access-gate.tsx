import "server-only"

import { hasPermission } from "~/src/integrations/better-auth/auth.access"
import { getCurrentSession } from "~/src/integrations/better-auth/auth.session"
import { redirect } from "~/src/integrations/next-intl/i18n.navigation"
import { getRootLocale } from "~/src/integrations/next-intl/i18n.root-params"

import { ROUTES } from "~/src/routes"

/**
 * Defense in depth behind the proxy: renders nothing, but bounces any request whose session does
 * not grant the admin console. Deferred into Suspense so it never blocks the static shell.
 */
export async function AdminAccessGate(): Promise<undefined> {
  const [session, locale] = await Promise.all([getCurrentSession(), getRootLocale()])

  if (!session) {
    redirect({ href: ROUTES.SIGN_IN, locale })
  }

  if (!hasPermission(session?.user.role, { admin: ["access"] })) {
    redirect({ href: ROUTES.APP, locale })
  }

  return undefined
}
