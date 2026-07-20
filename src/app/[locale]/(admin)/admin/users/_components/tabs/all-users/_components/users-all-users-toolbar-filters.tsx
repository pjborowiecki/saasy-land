"use client"

import { useCallback, type JSX } from "react"

import type { Key } from "@react-types/shared"
import { useTranslations } from "next-intl"

import { Select, SelectContent, SelectItem, SelectTrigger } from "~/src/components/shadcn/select"

import {
  USER_ROLES,
  USER_STATUSES,
  USERS_FILTER_ALL,
} from "~/src/app/[locale]/(admin)/admin/users/_components/tabs/all-users/_lib/users-filters"
import { isUserRole, isUserStatus } from "~/src/app/[locale]/(admin)/admin/users/_components/tabs/all-users/_lib/users-labels"

interface UsersAllUsersToolbarFiltersProps {
  readonly onRoleChange: (value: string | null) => void
  readonly onStatusChange: (value: string | null) => void
  readonly roleFilter: string
  readonly statusFilter: string
}

export function UsersAllUsersToolbarFilters({
  onRoleChange,
  onStatusChange,
  roleFilter,
  statusFilter,
}: Readonly<UsersAllUsersToolbarFiltersProps>): JSX.Element {
  const t = useTranslations("pages.admin.users")

  const roleLabel = isUserRole(roleFilter) ? t(`filters.role.options.${roleFilter}`) : roleFilter
  const statusLabel = isUserStatus(statusFilter) ? t(`filters.status.options.${statusFilter}`) : statusFilter

  const handleRoleChange = useCallback(
    (value: Key | null) => {
      if (typeof value === "string") {
        onRoleChange(value)
      }
    },
    [onRoleChange],
  )

  const handleStatusChange = useCallback(
    (value: Key | null) => {
      if (typeof value === "string") {
        onStatusChange(value)
      }
    },
    [onStatusChange],
  )

  return (
    <>
      <Select value={roleFilter} onChange={handleRoleChange}>
        <SelectTrigger className="min-w-36" size="sm">
          {roleFilter === USERS_FILTER_ALL ? t("filters.role.all") : t("filters.role.value", { role: roleLabel })}
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

      <Select value={statusFilter} onChange={handleStatusChange}>
        <SelectTrigger className="min-w-36" size="sm">
          {statusFilter === USERS_FILTER_ALL ? t("filters.status.all") : t("filters.status.value", { status: statusLabel })}
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
