import { CONSTANTS } from "~/src/constants"
import type { Role } from "~/src/constants/types"

import { ROLES_CONFIG } from "~/src/integrations/better-auth/auth.permissions"

/** Roles allowed to use the admin panel and Better Auth admin APIs. */
export const ADMIN_PANEL_ROLES = [CONSTANTS.PERMISSIONS.ROLES.ADMIN] as const

const ADMIN_PANEL_ROLE_SET: ReadonlySet<string> = new Set(ADMIN_PANEL_ROLES)

/** Better Auth admin plugin stores one or more comma-separated roles on the user record. */
export function parseUserRoles(role?: string | null): readonly string[] {
  if (role === undefined || role === null || role.length === 0) {
    return []
  }

  return role
    .split(",")
    .map((entry) => entry.trim())
    .filter(Boolean)
}

export function hasAdminAccess(role?: string | null) {
  return parseUserRoles(role).some((entry) => ADMIN_PANEL_ROLE_SET.has(entry))
}

export function getPostAuthRedirect(role: string | null | undefined) {
  return hasAdminAccess(role) ? CONSTANTS.ROUTES.ADMIN : CONSTANTS.ROUTES.APP
}

export function canAccess(role: Role, permission: Record<string, string | string[]>) {
  if (!(role in ROLES_CONFIG)) {
    return false
  }

  const roleConfig = ROLES_CONFIG[role]
  return roleConfig.authorize(permission).success
}
