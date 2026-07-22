import "server-only"

import { headers } from "next/headers"

import { createSafeActionClient } from "next-safe-action"

import { DomainError, type DomainErrorCode } from "~/src/modules/_core/errors/domain-error"

import type { PermissionRequest } from "~/src/integrations/better-auth/auth.access"
import { requireAuthenticatedSession, requirePermissionSession } from "~/src/integrations/better-auth/auth.guards"
import type { AuthSession } from "~/src/integrations/better-auth/auth.types"

export interface ActionServerError {
  code: DomainErrorCode
  message: string
}

export interface ActionContext {
  requestHeaders: Headers
  session: AuthSession
}

const baseActionClient = createSafeActionClient<undefined, ActionServerError>({
  handleServerError(error) {
    if (error instanceof DomainError) {
      return { code: error.code, message: error.message }
    }

    throw error
  },
})

/** Guest flows — sign-up, password reset, email verify, 2FA mid-login. */
export const publicActionClient = baseActionClient.use(async ({ next }) => {
  const requestHeaders = await headers()

  return next({ ctx: { requestHeaders } })
})

/**
 * Signed-in server actions. Pass a permission for RBAC (default).
 * Omit permission only for rare self-session actions (sign out, stop impersonating).
 */
export function authedActionClient(permission?: PermissionRequest) {
  return baseActionClient.use(async ({ next }) => {
    const requestHeaders = await headers()
    const session = permission === undefined ? await requireAuthenticatedSession() : await requirePermissionSession(permission)

    return next({ ctx: { requestHeaders, session } })
  })
}
