"use client"

import { useMemo } from "react"

import { type ColumnDef } from "@tanstack/react-table"
import { useTranslations } from "next-intl"

import type { AdminUserRow } from "~/src/app/[locale]/(admin)/admin/_types"
import {
  UsersLastActiveCell,
  UsersRoleCell,
  UsersStatusCell,
  UsersUserCell,
} from "~/src/app/[locale]/(admin)/admin/users/_components/tabs/all-users/_components/users-all-users-cells"

const USER_COLUMN_SIZE = 280
const ROLE_COLUMN_SIZE = 140
const STATUS_COLUMN_SIZE = 120
const LAST_ACTIVE_COLUMN_SIZE = 140

export function useUsersAllUsersColumns(): ColumnDef<AdminUserRow>[] {
  const t = useTranslations("pages.admin.users")

  return useMemo(
    () => [
      {
        accessorKey: "name",
        cell: UsersUserCell,
        header: t("table.headers.user"),
        minSize: USER_COLUMN_SIZE,
        size: USER_COLUMN_SIZE,
      },
      {
        accessorKey: "role",
        cell: UsersRoleCell,
        header: t("table.headers.role"),
        minSize: ROLE_COLUMN_SIZE,
        size: ROLE_COLUMN_SIZE,
      },
      {
        accessorKey: "status",
        cell: UsersStatusCell,
        header: t("table.headers.status"),
        minSize: STATUS_COLUMN_SIZE,
        size: STATUS_COLUMN_SIZE,
      },
      {
        accessorKey: "lastActive",
        cell: UsersLastActiveCell,
        header: t("table.headers.lastActive"),
        minSize: LAST_ACTIVE_COLUMN_SIZE,
        size: LAST_ACTIVE_COLUMN_SIZE,
      },
    ],
    [t],
  )
}
