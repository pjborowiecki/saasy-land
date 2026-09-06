import { redirect } from "@tanstack/react-router"

import { hasPermission } from "~/src/integrations/better-auth/auth.access"
import { getCurrentSession } from "~/src/integrations/better-auth/auth.session"

import { ROUTES } from "~/src/routes"

export const requireSession = async () => {
  const session = await getCurrentSession()
  if (!session) {
    throw redirect({ to: ROUTES.SIGN_IN })
  }
  return { session }
}

export const requireAdmin = async () => {
  const context = await requireSession()
  if (!hasPermission(context.session.user.role, { admin: ["access"] })) {
    throw redirect({ to: ROUTES.APP })
  }
  return context
}

export const redirectAfterAuth = async (): Promise<never> => {
  const { session } = await requireSession()
  throw redirect({ to: hasPermission(session.user.role, { admin: ["access"] }) ? ROUTES.ADMIN : ROUTES.APP })
}
