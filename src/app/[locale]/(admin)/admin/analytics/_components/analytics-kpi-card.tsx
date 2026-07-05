import type { JSX } from "react"

import type { LucideIcon } from "lucide-react"
import { getTranslations } from "next-intl/server"

import { Badge } from "~/src/components/shadcn/badge"
import { Card, CardContent } from "~/src/components/shadcn/card"

type AnalyticsKpiMetric = "mrr" | "activeUsers" | "churn" | "arpu"

interface AnalyticsKpiCardProps {
  readonly icon: LucideIcon
  readonly metric: AnalyticsKpiMetric
  readonly trendIcon: LucideIcon
}

export async function AnalyticsKpiCard({ icon: Icon, metric, trendIcon: TrendIcon }: AnalyticsKpiCardProps): Promise<JSX.Element> {
  const t = await getTranslations("admin.analytics")
  return (
    <Card className="group relative overflow-hidden border-border/80 transition-colors hover:border-border/40">
      <CardContent className="p-5">
        <div className="mb-4 flex items-start justify-between">
          <span className="text-sm font-medium text-muted-foreground">{t(`kpi.${metric}.title`)}</span>
          <div className="flex size-8 items-center justify-center rounded-lg border border-border/50 bg-secondary text-muted-foreground">
            <Icon className="size-4" />
          </div>
        </div>
        <div>
          <h3 className="text-3xl font-semibold tracking-tight text-foreground">{t(`kpi.${metric}.value`)}</h3>
          <div className="mt-2 flex items-center gap-2">
            <Badge
              variant="outline"
              className="border-emerald-500/20 bg-emerald-500/10 px-1.5 py-0.5 text-[10px] font-medium text-emerald-500"
            >
              <TrendIcon className="mr-1 size-3" /> {t(`kpi.${metric}.trend`)}
            </Badge>
            <span className="text-xs text-muted-foreground">{t(`kpi.${metric}.trendLabel`)}</span>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
