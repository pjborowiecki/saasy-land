import "server-only"

import { headers } from "next/headers"
import { forbidden, unauthorized } from "next/navigation"

import { hasPermission } from "~/src/integrations/better-auth/auth.access"
import { auth } from "~/src/integrations/better-auth/auth.server"
import { getCurrentSession } from "~/src/integrations/better-auth/auth.session"

export async function getUser(userId: string) {
  const session = await getCurrentSession()

  if (!session) {
    unauthorized()
  }

  if (!hasPermission(session?.user.role, { user: ["get"] })) {
    forbidden()
  }

  return auth.api.getUser({ headers: await headers(), query: { id: userId } })
}
