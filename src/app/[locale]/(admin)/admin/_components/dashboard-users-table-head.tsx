import type { JSX } from "react"

import { getTranslations } from "next-intl/server"

import { Checkbox } from "~/src/components/shadcn/checkbox"
import { TableHead, TableHeader, TableRow } from "~/src/components/shadcn/table"

export async function DashboardUsersTableHead(): Promise<JSX.Element> {
  const t = await getTranslations("admin.dashboard")
  return (
    <TableHeader>
      <TableRow>
        <TableHead className="w-12 text-center">
          <Checkbox />
        </TableHead>
        <TableHead>{t("users.table.columns.user")}</TableHead>
        <TableHead>{t("users.table.columns.role")}</TableHead>
        <TableHead>{t("users.table.columns.status")}</TableHead>
        <TableHead>{t("users.table.columns.lastActive")}</TableHead>
        <TableHead className="text-right">{t("users.table.columns.actions")}</TableHead>
      </TableRow>
    </TableHeader>
  )
}
