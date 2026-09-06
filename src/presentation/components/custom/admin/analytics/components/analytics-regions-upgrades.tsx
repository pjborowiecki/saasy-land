import type { JSX } from "react"

import { AnalyticsRegionsCard } from "~/src/presentation/components/custom/admin/analytics/components/analytics-regions-card"
import { AnalyticsUpgradesCard } from "~/src/presentation/components/custom/admin/analytics/components/analytics-upgrades-card"
import type { AdminAnalyticsRegionRow, AdminAnalyticsUpgradeRow } from "~/src/presentation/components/custom/admin/types"

interface AnalyticsRegionsUpgradesProps {
  readonly regions: readonly AdminAnalyticsRegionRow[]
  readonly upgrades: readonly AdminAnalyticsUpgradeRow[]
}

export const AnalyticsRegionsUpgrades = ({ regions, upgrades }: AnalyticsRegionsUpgradesProps): JSX.Element => (
  <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
    <AnalyticsRegionsCard regions={regions} />
    <AnalyticsUpgradesCard upgrades={upgrades} />
  </div>
)
