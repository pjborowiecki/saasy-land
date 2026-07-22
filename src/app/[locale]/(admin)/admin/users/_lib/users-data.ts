import "server-only"

import { ADMIN_INVITATION_ROWS, ADMIN_ROLE_ROWS, ADMIN_USER_ROWS } from "~/src/app/[locale]/(admin)/admin/_lib/mock-data"
import type { AdminInvitationRow, AdminRoleRow, AdminUserRow } from "~/src/app/[locale]/(admin)/admin/_types"

export function getAdminUsers(): Promise<AdminUserRow[]> {
  return Promise.resolve(ADMIN_USER_ROWS)
}

export function getAdminInvitations(): Promise<AdminInvitationRow[]> {
  return Promise.resolve(ADMIN_INVITATION_ROWS)
}

export function getAdminRoles(): Promise<AdminRoleRow[]> {
  return Promise.resolve(ADMIN_ROLE_ROWS)
}
