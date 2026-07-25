import type { JSX } from "react"

import { getTranslations } from "next-intl/server"

import { listUsers } from "~/src/modules/user/use-cases/list-users.use-case"

import { Link } from "~/src/integrations/next-intl/i18n.navigation"

import { Button } from "~/src/presentation/components/shadcn/button"
import { Card, CardHeader, CardTitle } from "~/src/presentation/components/shadcn/card"
import { Table, TableBody } from "~/src/presentation/components/shadcn/table"

import { DashboardUsersTableHead } from "~/src/app/[locale]/(admin)/admin/dashboard/_components/dashboard-users-table-head"
import { DashboardUsersTableRow } from "~/src/app/[locale]/(admin)/admin/dashboard/_components/dashboard-users-table-row"
import { DashboardUsersTableToolbar } from "~/src/app/[locale]/(admin)/admin/dashboard/_components/dashboard-users-table-toolbar"
import { mapUserRowToDashboardRow } from "~/src/app/[locale]/(admin)/admin/dashboard/_lib/map-user-to-dashboard-row"
import { ROUTES } from "~/src/routes"

const DASHBOARD_USER_PREVIEW_LIMIT = 5
const FIRST_PREVIEW_INDEX = 1

export async function DashboardUsersTable(): Promise<JSX.Element> {
  const [userRowsResult, t] = await Promise.all([listUsers(), getTranslations("pages.admin.dashboard")])
  const userRows = userRowsResult.data ?? []
  const users = userRows.slice(0, DASHBOARD_USER_PREVIEW_LIMIT).map((row) => mapUserRowToDashboardRow(row))

  const totalUserCount = userRows.length
  const previewCount = users.length
  const rangeStart = previewCount === 0 ? 0 : FIRST_PREVIEW_INDEX

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
        <span>
          {t("users.table.pagination.showing", {
            from: rangeStart,
            to: previewCount,
            total: totalUserCount,
          })}
        </span>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" className="h-7 px-2" isDisabled>
            {t("users.table.pagination.previous")}
          </Button>
          {previewCount < totalUserCount ? (
            <Link href={ROUTES.ADMIN_USERS}>
              <Button variant="outline" size="sm" className="h-7 px-2">
                {t("users.table.pagination.viewAll")}
              </Button>
            </Link>
          ) : (
            <Button variant="outline" size="sm" className="h-7 px-2" isDisabled>
              {t("users.table.pagination.viewAll")}
            </Button>
          )}
        </div>
      </div>
    </Card>
  )
}
