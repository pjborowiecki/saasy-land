"use client"

import { useMemo } from "react"

import { createColumnHelper } from "@tanstack/react-table"
import { useTranslations } from "next-intl"

import type { User } from "~/src/modules/user/user.types"
import { getUserStatus } from "~/src/modules/user/user.utils"

import { Checkbox } from "~/src/presentation/components/shadcn/checkbox"

import type { DataTableColumnDef, DataTableFeatures } from "~/src/presentation/components/custom/data-table/features"
import { toggleAllPageRowsSelected, toggleRowSelected } from "~/src/presentation/components/custom/data-table/utils/data-table-selection"

import { UserRowActions } from "~/src/app/[locale]/(admin)/admin/users/all/_components/actions"
import {
  BooleanCell,
  DateCell,
  RoleCell,
  StatusCell,
  TimezoneCell,
  UserCell,
} from "~/src/app/[locale]/(admin)/admin/users/all/_components/cells"

const columnHelper = createColumnHelper<DataTableFeatures, User["select"]>()

export function useAllUsersColumns(): DataTableColumnDef<User["select"]>[] {
  const t = useTranslations("pages.admin.users")

  return useMemo(
    () =>
      columnHelper.columns([
        columnHelper.display({
          cell: ({ row }) => (
            <Checkbox
              className="mx-auto"
              aria-label={t("table.selectRow")}
              isDisabled={!row.getCanSelect()}
              isSelected={row.getIsSelected()}
              onChange={toggleRowSelected(row)}
            />
          ),
          enableHiding: false,
          enableResizing: false,
          enableSorting: false,
          header: ({ table }) => (
            <Checkbox
              className="mx-auto"
              aria-label={t("table.selectAll")}
              isIndeterminate={!table.getIsAllPageRowsSelected() && table.getIsSomePageRowsSelected()}
              isSelected={table.getIsAllPageRowsSelected()}
              onChange={toggleAllPageRowsSelected(table)}
            />
          ),
          id: "select",
          size: 52,
        }),
        columnHelper.accessor("name", {
          cell: UserCell,
          header: t("table.headers.user"),
          id: "user",
          minSize: 240,
          size: 340,
        }),
        columnHelper.accessor("role", {
          cell: RoleCell,
          header: t("table.headers.role"),
          minSize: 75,
          size: 100,
        }),
        columnHelper.accessor((row) => getUserStatus(row), {
          cell: StatusCell,
          header: t("table.headers.status"),
          id: "status",
          minSize: 80,
          size: 100,
        }),
        columnHelper.accessor("emailVerified", {
          cell: BooleanCell,
          header: t("table.headers.emailVerified"),
          minSize: 120,
          size: 140,
        }),
        columnHelper.accessor("twoFactorEnabled", {
          cell: BooleanCell,
          header: t("table.headers.twoFactorEnabled"),
          minSize: 115,
          size: 130,
        }),
        columnHelper.accessor("timezone", {
          cell: TimezoneCell,
          header: t("table.headers.timezone"),
          minSize: 155,
          size: 170,
        }),
        columnHelper.accessor("createdAt", {
          cell: DateCell,
          header: t("table.headers.createdAt"),
          minSize: 180,
          size: 240,
          sortFn: "datetime",
        }),
        columnHelper.accessor("updatedAt", {
          cell: DateCell,
          header: t("table.headers.updatedAt"),
          minSize: 180,
          size: 240,
          sortFn: "datetime",
        }),
        columnHelper.display({
          cell: UserRowActions,
          enableResizing: false,
          enableSorting: false,
          header: "",
          id: "actions",
          meta: { align: "right" },
          size: 52,
        }),
      ]),
    [t],
  )
}
