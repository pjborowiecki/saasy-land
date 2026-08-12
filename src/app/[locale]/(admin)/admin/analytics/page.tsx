import type { Metadata } from "next"
import type { JSX } from "react"

import { Calendar, ChevronDown } from "lucide-react"
import { getTranslations } from "next-intl/server"

import { Button } from "~/src/presentation/components/shadcn/button"
import { Tabs, TabsList, TabsTrigger } from "~/src/presentation/components/shadcn/tabs"

import { ADMIN_ANALYTICS_REGION_ROWS, ADMIN_ANALYTICS_UPGRADE_ROWS } from "~/src/app/[locale]/(admin)/admin/_lib/mock-data"
import { AnalyticsOverviewTab } from "~/src/app/[locale]/(admin)/admin/analytics/_components/analytics-overview-tab"

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations("pages.admin.analytics")

  return {
    description: t("metadata.description"),
    title: t("metadata.title"),
  }
}

export default async function AnalyticsPage(): Promise<JSX.Element> {
  const t = await getTranslations("pages.admin.analytics")
  const regions = ADMIN_ANALYTICS_REGION_ROWS
  const upgrades = ADMIN_ANALYTICS_UPGRADE_ROWS

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
