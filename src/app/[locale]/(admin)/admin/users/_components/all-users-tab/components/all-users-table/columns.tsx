"use client"

import { createColumnHelper } from "@tanstack/react-table"
import { useTranslations } from "next-intl"

import type { User } from "~/src/modules/user/user.types"
import { getUserStatus } from "~/src/modules/user/user.utils"

import type { DataTableColumnDef } from "~/src/presentation/components/custom/data-table/_types/data-table.types"

import {
  BooleanCell,
  DateCell,
  RoleCell,
  StatusCell,
  TimezoneCell,
  UserCell,
} from "~/src/app/[locale]/(admin)/admin/users/_components/all-users-tab/components/all-users-table/cells"

const columnHelper = createColumnHelper<User["select"]>()

export function useAllUsersColumns(): DataTableColumnDef<User["select"]>[] {
  const t = useTranslations("pages.admin.users")

  return [
    columnHelper.accessor("name", {
      cell: UserCell,
      header: t("table.headers.user"),
      id: "user",
      minSize: 180,
      size: 180,
    }),
    columnHelper.accessor("role", {
      cell: RoleCell,
      header: t("table.headers.role"),
      minSize: 100,
      size: 100,
    }),
    columnHelper.accessor((row) => getUserStatus(row), {
      cell: StatusCell,
      header: t("table.headers.status"),
      id: "status",
      minSize: 100,
      size: 100,
    }),
    columnHelper.accessor("emailVerified", {
      cell: BooleanCell,
      header: t("table.headers.emailVerified"),
      minSize: 120,
      size: 120,
    }),
    columnHelper.accessor("twoFactorEnabled", {
      cell: BooleanCell,
      header: t("table.headers.twoFactorEnabled"),
      minSize: 100,
      size: 100,
    }),
    columnHelper.accessor("timezone", {
      cell: TimezoneCell,
      header: t("table.headers.timezone"),
      minSize: 140,
      size: 140,
    }),
    columnHelper.accessor("createdAt", {
      cell: DateCell,
      header: t("table.headers.createdAt"),
      minSize: 140,
      size: 140,
      sortingFn: "datetime",
    }),
    columnHelper.accessor("updatedAt", {
      cell: DateCell,
      header: t("table.headers.updatedAt"),
      minSize: 140,
      size: 140,
      sortingFn: "datetime",
    }),
  ]
}
