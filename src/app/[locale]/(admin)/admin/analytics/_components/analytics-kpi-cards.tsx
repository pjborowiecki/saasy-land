import type { JSX } from "react"

import { ArrowDownRight, ArrowUpRight, CircleDollarSign, Tag, UserMinus, Users } from "lucide-react"

import { AnalyticsKpiCard } from "~/src/app/[locale]/(admin)/admin/analytics/_components/analytics-kpi-card"

export function AnalyticsKpiCards(): JSX.Element {
  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4 lg:gap-6">
      <AnalyticsKpiCard icon={CircleDollarSign} metric="mrr" trendIcon={ArrowUpRight} />
      <AnalyticsKpiCard icon={Users} metric="activeUsers" trendIcon={ArrowUpRight} />
      <AnalyticsKpiCard icon={UserMinus} metric="churn" trendIcon={ArrowDownRight} />
      <AnalyticsKpiCard icon={Tag} metric="arpu" trendIcon={ArrowUpRight} />
    </div>
  )
}
