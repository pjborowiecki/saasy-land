import type { JSX } from "react"

import { createFileRoute } from "@tanstack/react-router"
import { Calendar, ChevronDown } from "lucide-react"
import { useTranslations } from "use-intl/react"

import { loadRouteMessages, routeHead } from "~/src/integrations/use-intl/i18n.metadata"

import { Button } from "~/src/presentation/components/shadcn/button"
import { Tabs, TabsList, TabsTrigger } from "~/src/presentation/components/shadcn/tabs"

import { AnalyticsOverviewTab } from "~/src/presentation/components/custom/admin/analytics/components/analytics-overview-tab"
import { useDemoAnalytics } from "~/src/presentation/components/custom/admin/analytics/hooks/use-demo-analytics"

const AnalyticsPage = (): JSX.Element => {
  const t = useTranslations("pages.admin.analytics")
  const { regions, upgrades } = useDemoAnalytics()

  return (
    <div className="flex w-full animate-in flex-col space-y-8 duration-500 fade-in-50">
      <div className="flex flex-col gap-4">
        <div>
          <h1 className="text-statement font-semibold text-foreground">{t("title")}</h1>
          <p className="text-sm text-muted-foreground">{t("description")}</p>
        </div>
      </div>

      <Tabs defaultSelectedKey="overview" className="w-full">
        <div className="flex flex-col gap-4 border-b border-border sm:flex-row sm:items-center sm:justify-between">
          <TabsList variant="line" className="no-scrollbar flex-1 justify-start gap-6 overflow-x-auto">
            <TabsTrigger id="overview" className="flex-none px-0 text-sm">
              {t("tabs.overview")}
            </TabsTrigger>
            <TabsTrigger id="revenue" className="flex-none px-0 text-sm">
              {t("tabs.revenue")}
            </TabsTrigger>
            <TabsTrigger id="audience" className="flex-none px-0 text-sm">
              {t("tabs.audience")}
            </TabsTrigger>
            <TabsTrigger id="retention" className="flex-none px-0 text-sm">
              {t("tabs.retention")}
            </TabsTrigger>
            <TabsTrigger id="reports" className="flex-none px-0 text-sm">
              {t("tabs.reports")}
            </TabsTrigger>
          </TabsList>

          <div className="flex flex-wrap items-center gap-3 pb-3 sm:pb-0">
            <Button variant="outline" size="sm" className="h-9 gap-2">
              <Calendar className="size-4 text-muted-foreground" />
              {t("actions.datePicker")}
              <ChevronDown className="ml-1 size-4 text-muted-foreground" />
            </Button>
          </div>
        </div>

        <AnalyticsOverviewTab regions={regions} upgrades={upgrades} />
      </Tabs>
    </div>
  )
}

export const Route = createFileRoute("/admin/analytics")({
  component: AnalyticsPage,
  head: routeHead,
  loader: ({ context }) =>
    loadRouteMessages({
      metadataNamespace: "pages.admin.analytics",
      namespaces: ["auth.errors", "auth.validations", "pages.admin", "pages.admin.analytics", "pages.admin.sidebar", "user.validations"],
      pathname: "/admin/analytics",
      queryClient: context.queryClient,
    }),
  staticData: {
    namespaces: ["auth.errors", "auth.validations", "pages.admin", "pages.admin.analytics", "pages.admin.sidebar", "user.validations"],
  },
})
