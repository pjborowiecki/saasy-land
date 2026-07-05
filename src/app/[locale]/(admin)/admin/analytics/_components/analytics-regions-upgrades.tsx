import type { JSX } from "react"

import type { AdminAnalyticsRegionRow, AdminAnalyticsUpgradeRow } from "~/src/lib/admin/demo-data.types"

import { AnalyticsRegionsCard } from "~/src/app/[locale]/(admin)/admin/analytics/_components/analytics-regions-card"
import { AnalyticsUpgradesCard } from "~/src/app/[locale]/(admin)/admin/analytics/_components/analytics-upgrades-card"

interface AnalyticsRegionsUpgradesProps {
  readonly regions: readonly AdminAnalyticsRegionRow[]
  readonly upgrades: readonly AdminAnalyticsUpgradeRow[]
}

export function AnalyticsRegionsUpgrades({ regions, upgrades }: AnalyticsRegionsUpgradesProps): JSX.Element {
  return (
    <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
      <AnalyticsRegionsCard regions={regions} />
      <AnalyticsUpgradesCard upgrades={upgrades} />
    </div>
  )
}
