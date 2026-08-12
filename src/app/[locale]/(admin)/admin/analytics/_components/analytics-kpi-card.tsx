import type { JSX } from "react"

import type { LucideIcon } from "lucide-react"
import { getTranslations } from "next-intl/server"

import { Badge } from "~/src/presentation/components/shadcn/badge"
import { Card, CardContent } from "~/src/presentation/components/shadcn/card"

type AnalyticsKpiMetric = "mrr" | "activeUsers" | "churn" | "arpu"

interface AnalyticsKpiCardProps {
  readonly icon: LucideIcon
  readonly metric: AnalyticsKpiMetric
  readonly trendIcon: LucideIcon
}

export async function AnalyticsKpiCard({ icon: Icon, metric, trendIcon: TrendIcon }: AnalyticsKpiCardProps): Promise<JSX.Element> {
  const t = await getTranslations("pages.admin.analytics")
  return (
    <Card className="group relative overflow-hidden border-border transition-colors hover:border-border">
      <CardContent className="p-5">
        <div className="mb-4 flex items-start justify-between">
          <span className="text-sm font-medium text-muted-foreground">{t(`kpi.${metric}.title`)}</span>
          <div className="flex size-8 items-center justify-center rounded-lg border border-border bg-secondary text-muted-foreground">
            <Icon className="size-4" />
          </div>
        </div>
        <div>
          <h3 className="text-3xl font-semibold tracking-tight text-foreground">{t(`kpi.${metric}.value`)}</h3>
          <div className="mt-2 flex items-center gap-2">
            <Badge variant="outline" className="px-0 text-xs font-medium text-ring">
              <TrendIcon className="mr-1 size-3" /> {t(`kpi.${metric}.trend`)}
            </Badge>
            <span className="text-xs text-muted-foreground">{t(`kpi.${metric}.trendLabel`)}</span>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
