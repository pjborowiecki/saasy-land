import type { JSX } from "react"

import { getTranslations } from "next-intl/server"

import { getUsers } from "~/src/modules/user/use-cases/get-users.use-case"

import { Link } from "~/src/integrations/next-intl/i18n.navigation"

import { Button } from "~/src/presentation/components/shadcn/button"
import { Card } from "~/src/presentation/components/shadcn/card"
import { Table, TableBody } from "~/src/presentation/components/shadcn/table"

import { DashboardUsersTableHead } from "~/src/app/[locale]/(admin)/admin/dashboard/_components/dashboard-users-table-head"
import { DashboardUsersTableRow } from "~/src/app/[locale]/(admin)/admin/dashboard/_components/dashboard-users-table-row"
import { DashboardUsersTableToolbar } from "~/src/app/[locale]/(admin)/admin/dashboard/_components/dashboard-users-table-toolbar"
import { mapUserRowToDashboardRow } from "~/src/app/[locale]/(admin)/admin/dashboard/_lib/map-user-to-dashboard-row"
import { ROUTES } from "~/src/routes"

const DASHBOARD_USER_PREVIEW_LIMIT = 5
const FIRST_PREVIEW_INDEX = 1

/**
 * Header, toolbar, rows, footer: four bands inside one card, separated by hairlines and nothing
 * else. `gap-0 py-0` overrides the Card's default vertical rhythm, because a card whose contents
 * are full-bleed bands must not also pad them apart.
 */
export async function DashboardUsersTable(): Promise<JSX.Element> {
  const [userRows, t] = await Promise.all([getUsers(), getTranslations("pages.admin.dashboard")])
  const users = userRows.slice(0, DASHBOARD_USER_PREVIEW_LIMIT).map((row) => mapUserRowToDashboardRow(row))

  const totalUserCount = userRows.length
  const previewCount = users.length
  const rangeStart = previewCount === 0 ? 0 : FIRST_PREVIEW_INDEX

  return (
    <Card className="flex flex-col gap-0 py-0">
      <div className="border-b border-border px-5 py-4">
        <h2 className="text-title text-foreground">{t("users.title")}</h2>
        <p className="mt-0.5 text-body-sm text-muted-foreground">{t("users.description")}</p>
      </div>

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

      <div className="flex flex-wrap items-center justify-between gap-3 border-t border-border px-5 py-3">
        <span className="font-mono text-[0.6875rem] text-muted-foreground tabular-nums">
          {t("users.table.pagination.showing", {
            from: rangeStart,
            to: previewCount,
            total: totalUserCount,
          })}
        </span>
        <div className="flex items-center gap-2">
          <Button className="h-7 px-2.5" isDisabled size="sm" variant="outline">
            {t("users.table.pagination.previous")}
          </Button>
          {previewCount < totalUserCount ? (
            <Link href={ROUTES.ADMIN_USERS}>
              <Button className="h-7 px-2.5" size="sm" variant="outline">
                {t("users.table.pagination.viewAll")}
              </Button>
            </Link>
          ) : (
            <Button className="h-7 px-2.5" isDisabled size="sm" variant="outline">
              {t("users.table.pagination.viewAll")}
            </Button>
          )}
        </div>
      </div>
    </Card>
  )
}
