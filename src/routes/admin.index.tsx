import { type JSX, Suspense } from "react"

import { Link, createFileRoute } from "@tanstack/react-router"
import { Calendar, PlusCircle } from "lucide-react"
import { useTranslations } from "use-intl/react"

import { loadRouteMessages, routeHead } from "~/src/integrations/use-intl/i18n.metadata"

import { getProductsQuery } from "~/src/modules/product/use-cases/get-products"
import { getUsersQuery } from "~/src/modules/user/use-cases/get-users"

import { Button } from "~/src/presentation/components/shadcn/button"

import { DashboardChart } from "~/src/presentation/components/custom/admin/dashboard/components/dashboard-chart"
import { DashboardStatsGrid } from "~/src/presentation/components/custom/admin/dashboard/components/dashboard-stats-grid"
import { DashboardStatsGridSkeleton } from "~/src/presentation/components/custom/admin/dashboard/components/dashboard-stats-grid-skeleton"
import { DashboardUsersTable } from "~/src/presentation/components/custom/admin/dashboard/components/dashboard-users-table"
import { DashboardUsersTableSkeleton } from "~/src/presentation/components/custom/admin/dashboard/components/dashboard-users-table-skeleton"

const DASHBOARD_STATS_GRID_FALLBACK = <DashboardStatsGridSkeleton />
const DASHBOARD_USERS_TABLE_FALLBACK = <DashboardUsersTableSkeleton />

const AdminPage = (): JSX.Element => {
  const t = useTranslations("pages.admin.dashboard")

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
          <Link to="/admin/products/create">
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

export const Route = createFileRoute("/admin/")({
  component: AdminPage,
  head: routeHead,
  loader: async ({ context }) => {
    const [metadata] = await Promise.all([
      loadRouteMessages({
        metadataNamespace: "pages.admin.dashboard",
        namespaces: ["auth.errors", "auth.validations", "pages.admin", "pages.admin.dashboard", "pages.admin.sidebar", "user.validations"],
        pathname: "/admin",
        queryClient: context.queryClient,
      }),
      context.queryClient.query({ ...getProductsQuery, staleTime: "static" }),
      context.queryClient.query({ ...getUsersQuery, staleTime: "static" }),
    ])
    return metadata
  },
  staticData: {
    namespaces: ["auth.errors", "auth.validations", "pages.admin", "pages.admin.dashboard", "pages.admin.sidebar", "user.validations"],
  },
})
