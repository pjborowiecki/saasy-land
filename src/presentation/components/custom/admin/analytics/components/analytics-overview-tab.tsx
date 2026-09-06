import type { JSX } from "react"

import { TabsContent } from "~/src/presentation/components/shadcn/tabs"

import { AnalyticsKpiCards } from "~/src/presentation/components/custom/admin/analytics/components/analytics-kpi-cards"
import { AnalyticsRegionsUpgrades } from "~/src/presentation/components/custom/admin/analytics/components/analytics-regions-upgrades"
import { AnalyticsRevenueChart } from "~/src/presentation/components/custom/admin/analytics/components/analytics-revenue-chart"
import type { AdminAnalyticsRegionRow, AdminAnalyticsUpgradeRow } from "~/src/presentation/components/custom/admin/types"

interface AnalyticsOverviewTabProps {
  readonly regions: readonly AdminAnalyticsRegionRow[]
  readonly upgrades: readonly AdminAnalyticsUpgradeRow[]
}

export const AnalyticsOverviewTab = ({ regions, upgrades }: AnalyticsOverviewTabProps): JSX.Element => (
  <TabsContent id="overview" className="mt-8 space-y-6 outline-none">
    <AnalyticsKpiCards />
    <AnalyticsRevenueChart />
    <AnalyticsRegionsUpgrades regions={regions} upgrades={upgrades} />
  </TabsContent>
)
