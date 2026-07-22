import "server-only"

import { ForbiddenError } from "~/src/modules/_core/errors/forbidden.error"
import { UnauthorizedError } from "~/src/modules/_core/errors/unauthorized.error"

import { hasPermission, type PermissionRequest } from "~/src/integrations/better-auth/auth.access"
import { getCurrentSession } from "~/src/integrations/better-auth/auth.session"
import type { AuthSession } from "~/src/integrations/better-auth/auth.types"

function assertAuthenticated(userId: string | undefined): asserts userId is string {
  if (userId === undefined || userId.length === 0) {
    throw new UnauthorizedError()
  }
}

function toAuthSession(session: NonNullable<Awaited<ReturnType<typeof getCurrentSession>>>): AuthSession {
  return {
    user: {
      id: session.user.id,
      ...(session.user.role === undefined ? {} : { role: session.user.role }),
    },
  }
}

/** Loads the session and throws if the caller is not signed in. */
export async function requireAuthenticatedSession(): Promise<AuthSession> {
  const session = await getCurrentSession()

  if (!session) {
    throw new UnauthorizedError()
  }

  assertAuthenticated(session.user.id)

  return toAuthSession(session)
}

/** Loads the session and throws unless the caller's role grants the permission. */
export async function requirePermissionSession(permission: PermissionRequest): Promise<AuthSession> {
  const session = await getCurrentSession()

  if (!session) {
    throw new UnauthorizedError()
  }

  assertAuthenticated(session.user.id)

  if (!hasPermission(session.user.role, permission)) {
    throw new ForbiddenError("Forbidden")
  }

  return toAuthSession(session)
}
