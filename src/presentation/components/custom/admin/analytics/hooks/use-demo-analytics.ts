import { useLocale, useTranslations } from "use-intl/react"

import { ADMIN_ANALYTICS_REGION_ROWS, ADMIN_ANALYTICS_UPGRADE_ROWS } from "~/src/data/admin"

import type { AdminAnalyticsRegionRow, AdminAnalyticsUpgradeRow } from "~/src/presentation/components/custom/admin/types"
export const useDemoAnalytics = (): { regions: AdminAnalyticsRegionRow[]; upgrades: AdminAnalyticsUpgradeRow[] } => {
  const t = useTranslations("pages.admin.analytics.demo")
  const locale = useLocale()
  const names = new Intl.DisplayNames(locale, { type: "region" })
  return {
    regions: ADMIN_ANALYTICS_REGION_ROWS.map((row) => ({
      flag: row.flag,
      name: names.of(row.code) ?? row.code,
      percentage: row.percentage,
    })),
    upgrades: ADMIN_ANALYTICS_UPGRADE_ROWS.map((row) => ({
      action: t(`upgrades.${row.id}.action`),
      colors: row.colors,
      initials: row.initials,
      name: row.name,
      time: t(`upgrades.${row.id}.time`),
    })),
  }
}
