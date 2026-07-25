"use client"

import { useCallback, useState, type JSX } from "react"

import type { Key } from "@react-types/shared"
import { useTranslations } from "next-intl"

import type { User } from "~/src/modules/user/user.types"
import { USER_STATUSES, getUserStatus, type UserStatus } from "~/src/modules/user/user.utils"

import { ROLE_VALUES } from "~/src/integrations/better-auth/auth.access"

import { Select, SelectContent, SelectItem, SelectTrigger } from "~/src/presentation/components/shadcn/select"

import type { StatusColor } from "~/src/app/[locale]/(admin)/admin/_types"

export const USER_ROLES = ROLE_VALUES
export const USERS_FILTER_ALL = "all" as const

export type UserRole = (typeof USER_ROLES)[number]

export interface AdminUsersListFilters {
  role: string
  status: string
}

export const DEFAULT_ADMIN_USERS_FILTERS: AdminUsersListFilters = {
  role: USERS_FILTER_ALL,
  status: USERS_FILTER_ALL,
}

export function isUserRole(value: string): value is UserRole {
  return (USER_ROLES as readonly string[]).includes(value)
}

function statusFilterLabel(status: string, t: (key: `filters.status.options.${UserStatus}`) => string): string {
  for (const value of USER_STATUSES) {
    if (value === status) {
      return t(`filters.status.options.${value}`)
    }
  }

  return status
}

export function userListStatusColor(row: User["select"]): StatusColor {
  const status = getUserStatus(row)

  if (status === "banned") {
    return "rose"
  }

  if (status === "pending") {
    return "amber"
  }

  return "emerald"
}

export function filterAdminUsers(users: readonly User["select"][], filters: AdminUsersListFilters): User["select"][] {
  return users.filter((user) => {
    if (filters.role !== USERS_FILTER_ALL && user.role !== filters.role) {
      return false
    }

    if (filters.status !== USERS_FILTER_ALL && getUserStatus(user) !== filters.status) {
      return false
    }

    return true
  })
}

/** Filter controls definition — state lives here until DataTable owns filtering. */
export function ToolbarFilters(): JSX.Element {
  const t = useTranslations("pages.admin.users")
  const [filters, setFilters] = useState<AdminUsersListFilters>(DEFAULT_ADMIN_USERS_FILTERS)
  const roleLabel = isUserRole(filters.role) ? t(`filters.role.options.${filters.role}`) : filters.role
  const statusLabel = filters.status === USERS_FILTER_ALL ? filters.status : statusFilterLabel(filters.status, t)

  const handleRoleChange = useCallback((value: Key | null) => {
    if (typeof value === "string") {
      setFilters((current) => ({ ...current, role: value }))
    }
  }, [])

  const handleStatusChange = useCallback((value: Key | null) => {
    if (typeof value === "string") {
      setFilters((current) => ({ ...current, status: value }))
    }
  }, [])

  return (
    <>
      <Select
        aria-label={t("table.headers.role")}
        fieldLabel={t("table.headers.role")}
        fieldLabelClassName="sr-only"
        value={filters.role}
        onChange={handleRoleChange}
      >
        <SelectTrigger className="min-w-36" size="sm">
          {filters.role === USERS_FILTER_ALL ? t("filters.role.all") : t("filters.role.value", { role: roleLabel })}
        </SelectTrigger>
        <SelectContent placement="bottom start">
          <SelectItem id={USERS_FILTER_ALL}>{t("filters.role.all")}</SelectItem>
          {USER_ROLES.map((role) => (
            <SelectItem key={role} id={role}>
              {t(`filters.role.options.${role}`)}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
      <Select
        aria-label={t("table.headers.status")}
        fieldLabel={t("table.headers.status")}
        fieldLabelClassName="sr-only"
        value={filters.status}
        onChange={handleStatusChange}
      >
        <SelectTrigger className="min-w-36" size="sm">
          {filters.status === USERS_FILTER_ALL ? t("filters.status.all") : t("filters.status.value", { status: statusLabel })}
        </SelectTrigger>
        <SelectContent placement="bottom start">
          <SelectItem id={USERS_FILTER_ALL}>{t("filters.status.all")}</SelectItem>
          {USER_STATUSES.map((status) => (
            <SelectItem key={status} id={status}>
              {t(`filters.status.options.${status}`)}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </>
  )
}
