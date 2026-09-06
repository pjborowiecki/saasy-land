import { ROLE_VALUES } from "~/src/integrations/better-auth/auth.access"

import type { User } from "~/src/modules/user/user.types"
import { type UserStatus, getUserStatus } from "~/src/modules/user/user.utils"

import type { StatusColor } from "~/src/presentation/components/custom/admin/types"

export const USER_ROLES = ROLE_VALUES

export type UserRole = (typeof USER_ROLES)[number]

export const isUserRole = (value: string): value is UserRole => (USER_ROLES as readonly string[]).includes(value)

const STATUS_COLORS: Record<UserStatus, StatusColor> = {
  active: "emerald",
  banned: "rose",
  pending: "amber",
}

export const userListStatusColor = (row: User["select"]): StatusColor => STATUS_COLORS[getUserStatus(row)]
