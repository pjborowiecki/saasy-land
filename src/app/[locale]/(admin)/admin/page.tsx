import type { Metadata } from "next"
import type { JSX } from "react"

import { Calendar, PlusCircle } from "lucide-react"
import { getTranslations } from "next-intl/server"

import { Button } from "~/src/presentation/components/shadcn/button"

import { DashboardChart } from "~/src/app/[locale]/(admin)/admin/_components/dashboard-chart"
import { DashboardSecurityCard } from "~/src/app/[locale]/(admin)/admin/_components/dashboard-security-card"
import { DashboardSessionsCard } from "~/src/app/[locale]/(admin)/admin/_components/dashboard-sessions-card"
import { DashboardStatsGrid } from "~/src/app/[locale]/(admin)/admin/_components/dashboard-stats-grid"
import { DashboardUsersTable } from "~/src/app/[locale]/(admin)/admin/_components/dashboard-users-table"
import {
  DASHBOARD_CHART_X_AXIS,
  DASHBOARD_CHART_Y_AXIS,
  DASHBOARD_SESSION_ITEMS,
  DASHBOARD_USER_ROWS,
} from "~/src/app/[locale]/(admin)/admin/_lib/mock-data"

export async function generateMetadata({ params }: Readonly<PageProps<"/[locale]/admin">>): Promise<Metadata> {
  const { locale } = await params
  const t = await getTranslations({ locale, namespace: "pages.admin.dashboard" })

  return {
    description: t("description"),
    title: t("title"),
  }
}

export default async function AppPage({ params }: Readonly<PageProps<"/[locale]/admin">>): Promise<JSX.Element> {
  const { locale } = await params
  const t = await getTranslations({ locale, namespace: "pages.admin.dashboard" })

  const users = DASHBOARD_USER_ROWS
  const sessions = DASHBOARD_SESSION_ITEMS
  const chartYAxis = DASHBOARD_CHART_Y_AXIS
  const chartXAxis = DASHBOARD_CHART_X_AXIS

  return (
    <div className="flex w-full animate-in flex-col space-y-8 pb-8 duration-500 fade-in-50">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h1 className="mb-1 text-2xl font-medium tracking-tight text-foreground">{t("title")}</h1>
          <p className="text-sm text-muted-foreground">{t("description")}</p>
        </div>
        <div className="flex items-center gap-3">
          <Button variant="outline" className="h-9 gap-2">
            <Calendar className="size-4 text-muted-foreground" />
            {t("actions.last30Days")}
          </Button>
          <Button className="h-9 gap-2 shadow-sm">
            <PlusCircle className="size-4" />
            {t("actions.addProduct")}
          </Button>
        </div>
      </div>

      <DashboardStatsGrid />
      <DashboardChart chartXAxis={chartXAxis} chartYAxis={chartYAxis} />

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <div className="space-y-6 lg:col-span-2">
          <DashboardUsersTable users={users} />
        </div>

        <div className="space-y-6">
          <DashboardSessionsCard sessions={sessions} />
          <DashboardSecurityCard />
        </div>
      </div>
    </div>
  )
}
