import { USER_ROLES, USER_STATUSES } from "~/src/app/[locale]/(admin)/admin/users/_components/tabs/all-users/_lib/users-filters"

export type UserRole = (typeof USER_ROLES)[number]
export type UserStatus = (typeof USER_STATUSES)[number]

export function isUserRole(value: string): value is UserRole {
  return (USER_ROLES as readonly string[]).includes(value)
}

export function isUserStatus(value: string): value is UserStatus {
  return (USER_STATUSES as readonly string[]).includes(value)
}
