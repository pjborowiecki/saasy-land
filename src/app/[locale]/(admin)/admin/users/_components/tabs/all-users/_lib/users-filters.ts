import type { AdminUserRow } from "~/src/app/[locale]/(admin)/admin/_types"

export const USERS_FILTER_ALL = "all" as const

export const USER_ROLES = ["Administrator", "Editor", "Viewer", "Subscriber"] as const
export const USER_STATUSES = ["Active", "Pending", "Banned"] as const

export interface AdminUsersListFilters {
  role: string
  status: string
}

export const DEFAULT_ADMIN_USERS_FILTERS: AdminUsersListFilters = {
  role: USERS_FILTER_ALL,
  status: USERS_FILTER_ALL,
}

export function areAdminUsersFiltersEqual(left: AdminUsersListFilters, right: AdminUsersListFilters): boolean {
  return left.role === right.role && left.status === right.status
}

export function filterAdminUsers(users: readonly AdminUserRow[], filters: AdminUsersListFilters): AdminUserRow[] {
  return users.filter((user) => {
    if (filters.role !== USERS_FILTER_ALL && user.role !== filters.role) {
      return false
    }

    if (filters.status !== USERS_FILTER_ALL && user.status !== filters.status) {
      return false
    }

    return true
  })
}
