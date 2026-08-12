import type { Metadata } from "next"
import { Suspense, type JSX } from "react"

import { Calendar, PlusCircle } from "lucide-react"
import { getTranslations } from "next-intl/server"

import { Link } from "~/src/integrations/next-intl/i18n.navigation"

import { Button } from "~/src/presentation/components/shadcn/button"

import { DashboardChart } from "~/src/app/[locale]/(admin)/admin/dashboard/_components/dashboard-chart"
import { DashboardStatsGrid } from "~/src/app/[locale]/(admin)/admin/dashboard/_components/dashboard-stats-grid"
import { DashboardStatsGridSkeleton } from "~/src/app/[locale]/(admin)/admin/dashboard/_components/dashboard-stats-grid-skeleton"
import { DashboardUsersTable } from "~/src/app/[locale]/(admin)/admin/dashboard/_components/dashboard-users-table"
import { DashboardUsersTableSkeleton } from "~/src/app/[locale]/(admin)/admin/dashboard/_components/dashboard-users-table-skeleton"

const DASHBOARD_STATS_GRID_FALLBACK = <DashboardStatsGridSkeleton />
const DASHBOARD_USERS_TABLE_FALLBACK = <DashboardUsersTableSkeleton />

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations("pages.admin.dashboard")

  return {
    description: t("description"),
    title: t("title"),
  }
}

export default async function AdminPage(): Promise<JSX.Element> {
  const t = await getTranslations("pages.admin.dashboard")

  return (
    <div className="flex w-full animate-in flex-col space-y-8 pb-8 duration-500 fade-in-50">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h1 className="text-statement font-semibold text-foreground">{t("title")}</h1>
          <p className="text-sm text-muted-foreground">{t("description")}</p>
        </div>
        <div className="flex items-center gap-3">
          <Button variant="outline" className="h-9 gap-2" isDisabled>
            <Calendar className="size-4 text-muted-foreground" />
            {t("actions.last30Days")}
          </Button>
          <Link href="/admin/products/create">
            <Button className="h-9 gap-2 shadow-sm">
              <PlusCircle className="size-4" />
              {t("actions.addProduct")}
            </Button>
          </Link>
        </div>
      </div>

      <Suspense fallback={DASHBOARD_STATS_GRID_FALLBACK}>
        <DashboardStatsGrid />
      </Suspense>

      <DashboardChart />

      <Suspense fallback={DASHBOARD_USERS_TABLE_FALLBACK}>
        <DashboardUsersTable />
      </Suspense>
    </div>
  )
}
