import type { JSX } from "react"

import { useTranslations } from "use-intl/react"

import { Checkbox } from "~/src/presentation/components/shadcn/checkbox"
import { TableHead, TableHeader, TableRow } from "~/src/presentation/components/shadcn/table"

export const DashboardUsersTableHead = (): JSX.Element => {
  const t = useTranslations("pages.admin.dashboard")
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
