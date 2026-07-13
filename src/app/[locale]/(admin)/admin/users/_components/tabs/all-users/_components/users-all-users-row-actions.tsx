"use client"

import type { JSX } from "react"

import { type CellContext } from "@tanstack/react-table"
import { useTranslations } from "next-intl"

import { DropdownMenuItem, DropdownMenuSeparator } from "~/src/components/shadcn/dropdown-menu"

import { DataTableRowActionsButton } from "~/src/components/custom/data-table/data-table"

import type { AdminUserRow } from "~/src/app/[locale]/(admin)/admin/_types"

export function UsersAllUsersRowActions(_context: Readonly<CellContext<AdminUserRow, unknown>>): JSX.Element {
  const t = useTranslations("pages.admin.users")

  return (
    <DataTableRowActionsButton>
      <DropdownMenuItem>{t("actions.row.edit")}</DropdownMenuItem>
      <DropdownMenuItem>{t("actions.row.viewProfile")}</DropdownMenuItem>
      <DropdownMenuItem>{t("actions.row.resetPassword")}</DropdownMenuItem>
      <DropdownMenuSeparator />
      <DropdownMenuItem>{t("actions.row.ban")}</DropdownMenuItem>
      <DropdownMenuItem variant="destructive">{t("actions.row.delete")}</DropdownMenuItem>
    </DataTableRowActionsButton>
  )
}
