import type { User } from "~/src/modules/user/user.types"

export const USER_STATUSES = ["active", "pending", "banned"] as const

export type UserStatus = (typeof USER_STATUSES)[number]

/** Derived from `banned` + `emailVerified` — not a DB column. */
export function getUserStatus(row: Pick<User["select"], "banned" | "emailVerified">): UserStatus {
  if (row.banned) {
    return "banned"
  }

  if (!row.emailVerified) {
    return "pending"
  }

  return "active"
}
