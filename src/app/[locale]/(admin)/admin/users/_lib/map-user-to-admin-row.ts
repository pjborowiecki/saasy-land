import type { User } from "~/src/modules/user/user.types"

import type { AdminUserRow, StatusColor } from "~/src/app/[locale]/(admin)/admin/_types"

const AVATAR_COLORS = [
  "from-blue-400 to-indigo-500",
  "from-emerald-400 to-teal-500",
  "from-fuchsia-400 to-pink-500",
  "from-amber-400 to-orange-500",
  "from-cyan-400 to-sky-500",
] as const

const AVATAR_COLOR_COUNT = AVATAR_COLORS.length

const STATUS = {
  ACTIVE: "Active",
  BANNED: "Banned",
  PENDING: "Pending",
} as const

const DATE_SLICE_END = 10
const INITIALS_LENGTH = 2

function initialsFromName(name: string): string {
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

function avatarColorForId(id: string): string {
  let hash = 0
  for (const character of id) {
    hash = (hash + (character.codePointAt(0) ?? 0)) % AVATAR_COLOR_COUNT
  }
  return AVATAR_COLORS[hash] ?? AVATAR_COLORS[0]
}

function statusFromRow(row: User["select"]): { readonly status: string; readonly statusColor: StatusColor } {
  if (row.banned) {
    return { status: STATUS.BANNED, statusColor: "rose" }
  }

  if (!row.emailVerified) {
    return { status: STATUS.PENDING, statusColor: "amber" }
  }

  return { status: STATUS.ACTIVE, statusColor: "emerald" }
}

export function mapUserRowToAdminRow(row: User["select"]): AdminUserRow {
  const { status, statusColor } = statusFromRow(row)
  const base = {
    email: row.email,
    id: row.id,
    isBanned: row.banned,
    lastActive: row.updatedAt.toISOString().slice(0, DATE_SLICE_END),
    name: row.name,
    role: row.role,
    status,
    statusColor,
  }

  if (typeof row.image === "string" && row.image.length > 0) {
    return {
      ...base,
      avatar: row.image,
    }
  }

  return {
    ...base,
    colors: avatarColorForId(row.id),
    initials: initialsFromName(row.name),
  }
}
