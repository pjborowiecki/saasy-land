import { CONSTANTS } from "~/src/constants"
import type { Role } from "~/src/constants/types"

import { ROLES_CONFIG } from "~/src/integrations/better-auth/auth.permissions"

/** Roles allowed to use the admin panel and Better Auth admin APIs. */
export const ADMIN_PANEL_ROLES = [CONSTANTS.PERMISSIONS.ROLES.ADMIN] as const

export function hasAdminAccess(role: string | null | undefined) {
  if (!role) {
    return false
  }

  return (ADMIN_PANEL_ROLES as readonly string[]).includes(role)
}

export function getPostAuthRedirect(role: string | null | undefined) {
  return hasAdminAccess(role) ? CONSTANTS.ROUTES.ADMIN : CONSTANTS.ROUTES.APP
}

export function canAccess(role: Role, permission: Record<string, string | string[]>) {
  const roleConfig = ROLES_CONFIG[role]

  if (!roleConfig) {
    return false
  }

  return roleConfig.authorize(permission).success
}
