import type { JSX } from "react"

import { getTranslations } from "next-intl/server"

import { Card } from "~/src/components/shadcn/card"

import { AnalyticsChartBar, type AnalyticsChartBarData } from "~/src/app/[locale]/(admin)/admin/_components/analytics-chart-bar"

const ANALYTICS_CHART_BARS: AnalyticsChartBarData[] = [
  { height1: "45%", height2: "15%", id: "1", label: "May 1: $2,400" },
  { height1: "35%", height2: "20%", id: "2" },
  { height1: "60%", height2: "25%", id: "3" },
  { height1: "50%", height2: "30%", id: "4" },
  { height1: "40%", height2: "22%", id: "5" },
  { height1: "70%", height2: "18%", id: "6" },
  { height1: "85%", height2: "15%", id: "7" },
  { height1: "55%", height2: "25%", id: "8" },
  { height1: "45%", height2: "35%", id: "9" },
  { height1: "30%", height2: "20%", id: "10" },
  { height1: "65%", height2: "15%", id: "11" },
  { height1: "75%", height2: "20%", id: "12" },
  { active: true, height1: "90%", height2: "10%", id: "13", label: "Today: $4,200" },
  { height1: "80%", height2: "12%", id: "14" },
  { height1: "60%", height2: "25%", id: "15" },
  { height1: "50%", height2: "35%", id: "16" },
  { height1: "70%", height2: "20%", id: "17" },
  { height1: "40%", height2: "15%", id: "18" },
]

const ANALYTICS_Y_AXIS_LABELS = ["$4k", "$3k", "$2k", "$1k", "$0"] as const

export async function AnalyticsRevenueChart(): Promise<JSX.Element> {
  const t = await getTranslations("admin.analytics")
  return (
    <Card className="group relative overflow-hidden border-border/80 transition-colors hover:border-border/40">
      <div className="flex flex-col gap-4 border-b border-border/40 p-5 sm:flex-row sm:items-center sm:justify-between lg:p-6">
        <div>
          <h2 className="text-base font-medium text-foreground">{t("chart.title")}</h2>
          <p className="mt-1 text-xs text-muted-foreground">{t("chart.description")}</p>
        </div>
        <div className="flex items-center gap-4 text-xs font-medium">
          <div className="flex items-center gap-2 text-foreground/80">
            <span className="size-2.5 rounded-sm bg-primary" />
            {t("chart.legend.new")}
          </div>
          <div className="flex items-center gap-2 text-muted-foreground">
            <span className="size-2.5 rounded-sm bg-secondary" />
            {t("chart.legend.renewals")}
          </div>
        </div>
      </div>

      <div className="relative flex h-72 flex-col p-6">
        <div className="pointer-events-none absolute inset-y-6 right-6 left-6 z-0 flex flex-col justify-between">
          {ANALYTICS_Y_AXIS_LABELS.map((label) => (
            <div key={label} className="flex w-full items-center justify-start border-t border-border/20">
              <span className="-mt-2 bg-card pr-2 text-xs text-muted-foreground">{label}</span>
            </div>
          ))}
        </div>

        <div className="z-10 ml-8 flex flex-1 items-end gap-1 pt-4 pb-0.5 sm:gap-2">
          {ANALYTICS_CHART_BARS.map((bar) => (
            <AnalyticsChartBar key={bar.id} bar={bar} />
          ))}
        </div>
      </div>
    </Card>
  )
}
