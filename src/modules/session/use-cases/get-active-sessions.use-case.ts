import "server-only"

import { headers } from "next/headers"
import { unauthorized } from "next/navigation"

import { auth } from "~/src/integrations/better-auth/auth.server"
import { getCurrentSession } from "~/src/integrations/better-auth/auth.session"

export async function getActiveSessions() {
  const session = await getCurrentSession()

  if (!session) {
    unauthorized()
  }

  return auth.api.listSessions({ headers: await headers() })
}
