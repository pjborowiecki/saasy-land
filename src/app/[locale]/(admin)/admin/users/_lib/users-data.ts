import "server-only"

import { cache } from "react"

import { listUsers } from "~/src/modules/user/use-cases/list-users.use-case"

import { ADMIN_INVITATION_ROWS, ADMIN_ROLE_ROWS } from "~/src/app/[locale]/(admin)/admin/_lib/mock-data"
import { unwrapServerActionData } from "~/src/app/[locale]/(admin)/admin/_lib/server-action-result"
import type { AdminInvitationRow, AdminRoleRow, AdminUserRow } from "~/src/app/[locale]/(admin)/admin/_types"
import { mapUserRowToAdminRow } from "~/src/app/[locale]/(admin)/admin/users/_lib/map-user-to-admin-row"

/** RSC read. `cache()` = per-request dedupe; no `use cache` (admin PII stays fresh). */
export const getAdminUsers = cache(async (): Promise<AdminUserRow[]> => {
  const result = await listUsers()

  return unwrapServerActionData(result).map((row) => mapUserRowToAdminRow(row))
})

export function getAdminInvitations(): Promise<AdminInvitationRow[]> {
  return Promise.resolve(ADMIN_INVITATION_ROWS)
}

export function getAdminRoles(): Promise<AdminRoleRow[]> {
  return Promise.resolve(ADMIN_ROLE_ROWS)
}
