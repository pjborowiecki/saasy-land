import type { JSX } from "react"

import { getTranslations } from "next-intl/server"

import type { DashboardUserRow } from "~/src/lib/admin/demo-data.types"

import { Button } from "~/src/components/shadcn/button"
import { Card, CardHeader, CardTitle } from "~/src/components/shadcn/card"
import { Table, TableBody } from "~/src/components/shadcn/table"

import { DashboardUsersTableHead } from "~/src/app/[locale]/(admin)/admin/_components/dashboard-users-table-head"
import { DashboardUsersTableRow } from "~/src/app/[locale]/(admin)/admin/_components/dashboard-users-table-row"
import { DashboardUsersTableToolbar } from "~/src/app/[locale]/(admin)/admin/_components/dashboard-users-table-toolbar"

interface DashboardUsersTableProps {
  readonly users: readonly DashboardUserRow[]
}

export async function DashboardUsersTable({ users }: DashboardUsersTableProps): Promise<JSX.Element> {
  const t = await getTranslations("admin.dashboard")
  return (
    <Card className="group relative flex flex-col overflow-hidden border-border/80 transition-colors hover:border-border/40">
      <CardHeader className="flex flex-row items-center justify-between border-b border-border/40 p-5">
        <div>
          <CardTitle className="mb-1 text-base font-medium text-foreground">{t("users.title")}</CardTitle>
          <p className="text-xs text-muted-foreground">{t("users.description")}</p>
        </div>
      </CardHeader>

      <DashboardUsersTableToolbar />

      <div className="custom-scrollbar w-full overflow-x-auto">
        <Table>
          <DashboardUsersTableHead />
          <TableBody>
            {users.map((row) => (
              <DashboardUsersTableRow key={row.id} row={row} />
            ))}
          </TableBody>
        </Table>
      </div>

      <div className="flex items-center justify-between border-t border-border/40 p-4 text-xs text-muted-foreground">
        <span>{t("users.table.pagination.showing")}</span>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" className="h-7 px-2" disabled>
            {t("users.table.pagination.previous")}
          </Button>
          <Button variant="outline" size="sm" className="h-7 px-2">
            {t("users.table.pagination.next")}
          </Button>
        </div>
      </div>
    </Card>
  )
}
