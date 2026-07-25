import type { JSX } from "react"

import { getTranslations } from "next-intl/server"

import { Button } from "~/src/presentation/components/shadcn/button"

export async function DashboardChartHeader(): Promise<JSX.Element> {
  const t = await getTranslations("pages.admin.dashboard")
  return (
    <div className="mb-8 flex items-center justify-between">
      <div>
        <h2 className="mb-1 text-base font-medium text-foreground">{t("chart.title")}</h2>
        <p className="text-xs text-muted-foreground">{t("chart.description")}</p>
      </div>
      <div className="flex items-center gap-1 rounded-lg border border-border/50 bg-secondary/50 p-1">
        <Button variant="secondary" size="sm" className="h-7 px-3 text-xs shadow-sm">
          {t("chart.filters.12m")}
        </Button>
        <Button variant="ghost" size="sm" className="h-7 px-3 text-xs text-muted-foreground hover:text-foreground">
          {t("chart.filters.30d")}
        </Button>
        <Button variant="ghost" size="sm" className="h-7 px-3 text-xs text-muted-foreground hover:text-foreground">
          {t("chart.filters.7d")}
        </Button>
      </div>
    </div>
  )
}
