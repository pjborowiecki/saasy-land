import { redirect } from "@tanstack/react-router"

import { hasPermission } from "~/src/integrations/better-auth/auth.access"
import { getCurrentSessionQuery } from "~/src/integrations/better-auth/auth.session"

import type { RouterContext } from "~/src/router"
import { ROUTES } from "~/src/routes"

interface AuthRouteContext {
  context: RouterContext
  preload?: boolean
}

const loadRouteSession = async ({ context: { queryClient }, preload = false }: AuthRouteContext) => {
  const previousSession = queryClient.getQueryData(getCurrentSessionQuery.queryKey)
  const session = await queryClient.query({ ...getCurrentSessionQuery, ...(preload ? {} : { staleTime: 0 }) })
  if (previousSession?.user.id !== session?.user.id) {
    queryClient.clear()
    queryClient.setQueryData(getCurrentSessionQuery.queryKey, session)
  }
  return session
}

const redirectToWorkspace = (role: string | null | undefined): never => {
  throw redirect({ replace: true, to: hasPermission(role, { admin: ["access"] }) ? ROUTES.ADMIN : ROUTES.APP })
}

export const redirectIfSignedIn = async (context: AuthRouteContext): Promise<void> => {
  const session = await loadRouteSession(context)
  if (session) {
    redirectToWorkspace(session.user.role)
  }
}

export const requireSignedIn = async (context: AuthRouteContext) => {
  const session = await loadRouteSession(context)
  if (!session) {
    throw redirect({ replace: true, to: ROUTES.SIGN_IN })
  }
  return { session }
}

export const requireAdmin = async (context: AuthRouteContext) => {
  const result = await requireSignedIn(context)
  if (!hasPermission(result.session.user.role, { admin: ["access"] })) {
    throw redirect({ replace: true, to: ROUTES.APP })
  }
  return result
}

export const redirectAfterAuth = async (context: AuthRouteContext): Promise<never> => {
  const { session } = await requireSignedIn(context)
  return redirectToWorkspace(session.user.role)
}
