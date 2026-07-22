import { PERMISSIONS, type RoleName } from "~/src/modules/identity-access/domain/permissions"
import { ROLES_CONFIG } from "~/src/modules/identity-access/infrastructure/auth/auth.permissions"

/** Roles allowed to use the admin panel and Better Auth admin APIs. */
export const ADMIN_PANEL_ROLES = [PERMISSIONS.ROLES.ADMIN] as const

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

export function canAccess(role: RoleName, permission: Record<string, string | string[]>) {
  if (!(role in ROLES_CONFIG)) {
    return false
  }

  const roleConfig = ROLES_CONFIG[role]
  return roleConfig.authorize(permission).success
}
