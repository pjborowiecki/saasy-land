import type { JSX } from "react"

import { TabsContent } from "~/src/components/shadcn/tabs"

import type { AdminAnalyticsRegionRow, AdminAnalyticsUpgradeRow } from "~/src/app/[locale]/(admin)/admin/_types"
import { AnalyticsKpiCards } from "~/src/app/[locale]/(admin)/admin/analytics/_components/analytics-kpi-cards"
import { AnalyticsRegionsUpgrades } from "~/src/app/[locale]/(admin)/admin/analytics/_components/analytics-regions-upgrades"
import { AnalyticsRevenueChart } from "~/src/app/[locale]/(admin)/admin/analytics/_components/analytics-revenue-chart"

interface AnalyticsOverviewTabProps {
  readonly regions: readonly AdminAnalyticsRegionRow[]
  readonly upgrades: readonly AdminAnalyticsUpgradeRow[]
}

export function AnalyticsOverviewTab({ regions, upgrades }: AnalyticsOverviewTabProps): JSX.Element {
  return (
    <TabsContent value="overview" className="mt-8 space-y-6 outline-none">
      <AnalyticsKpiCards />
      <AnalyticsRevenueChart />
      <AnalyticsRegionsUpgrades regions={regions} upgrades={upgrades} />
    </TabsContent>
  )
}
