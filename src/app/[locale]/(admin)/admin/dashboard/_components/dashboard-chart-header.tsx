import type { JSX } from "react"

import { getTranslations } from "next-intl/server"

import { Button } from "~/src/presentation/components/shadcn/button"

/**
 * A segmented control, not three loose buttons. The selected range is filled and the other two
 * are transparent inside one bordered track, so the group reads as one control with a state
 * rather than as three actions of unequal importance.
 */
export async function DashboardChartHeader(): Promise<JSX.Element> {
  const t = await getTranslations("pages.admin.dashboard")

  return (
    <div className="flex flex-wrap items-start justify-between gap-4">
      <div>
        <h2 className="text-title text-foreground">{t("chart.title")}</h2>
        <p className="mt-1 text-body-sm text-muted-foreground">{t("chart.description")}</p>
      </div>
      <div className="flex items-center gap-0.5 rounded-lg border border-border bg-muted/50 p-0.5">
        <Button className="h-7 rounded-md px-2.5 text-xs" size="sm" variant="secondary">
          {t("chart.filters.12m")}
        </Button>
        <Button className="h-7 rounded-md px-2.5 text-xs text-muted-foreground" size="sm" variant="ghost">
          {t("chart.filters.30d")}
        </Button>
        <Button className="h-7 rounded-md px-2.5 text-xs text-muted-foreground" size="sm" variant="ghost">
          {t("chart.filters.7d")}
        </Button>
      </div>
    </div>
  )
}
