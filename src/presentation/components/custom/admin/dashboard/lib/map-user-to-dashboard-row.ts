import type { User } from "~/src/modules/user/user.types"
import { getUserStatus } from "~/src/modules/user/user.utils"

import type { DashboardUserRow } from "~/src/presentation/components/custom/admin/types"

const DATE_SLICE_END = 10
const INITIALS_LENGTH = 2

const initialsFromName = (name: string): string => {
  const parts = name
    .trim()
    .split(/\s+/u)
    .filter((part) => part.length > 0)
  const [first = "?", second] = parts

  if (second === undefined) {
    return first.slice(0, INITIALS_LENGTH).toUpperCase()
  }

  return `${first.charAt(0)}${second.charAt(0)}`.toUpperCase()
}

export const mapUserRowToDashboardRow = (row: User["select"]): DashboardUserRow => {
  const base = {
    email: row.email,
    id: row.id,
    lastActive: row.updatedAt.toISOString().slice(0, DATE_SLICE_END),
    name: row.name,
    role: row.role,
    status: getUserStatus(row),
  }

  if (typeof row.image === "string" && row.image.length > 0) {
    return {
      ...base,
      avatar: row.image,
    }
  }

  return {
    ...base,
    initials: initialsFromName(row.name),
  }
}
