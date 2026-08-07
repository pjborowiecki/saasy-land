import type { User } from "~/src/modules/user/user.types"
import { getUserStatus, type UserStatus } from "~/src/modules/user/user.utils"

import { ROLE_VALUES } from "~/src/integrations/better-auth/auth.access"

import type { StatusColor } from "~/src/app/[locale]/(admin)/admin/_types"

export const USER_ROLES = ROLE_VALUES

export type UserRole = (typeof USER_ROLES)[number]

export function isUserRole(value: string): value is UserRole {
  return (USER_ROLES as readonly string[]).includes(value)
}

const STATUS_COLORS: Record<UserStatus, StatusColor> = {
  active: "emerald",
  banned: "rose",
  pending: "amber",
}

export function userListStatusColor(row: User["select"]): StatusColor {
  return STATUS_COLORS[getUserStatus(row)]
}
