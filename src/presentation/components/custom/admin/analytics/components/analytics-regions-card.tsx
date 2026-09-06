import type { JSX } from "react"

import { useTranslations } from "use-intl/react"

import { Button } from "~/src/presentation/components/shadcn/button"
import { Card, CardContent } from "~/src/presentation/components/shadcn/card"

import { RegionProgressBar } from "~/src/presentation/components/custom/admin/analytics/components/region-progress-bar"
import type { AdminAnalyticsRegionRow } from "~/src/presentation/components/custom/admin/types"

interface AnalyticsRegionsCardProps {
  readonly regions: readonly AdminAnalyticsRegionRow[]
}

export const AnalyticsRegionsCard = ({ regions }: AnalyticsRegionsCardProps): JSX.Element => {
  const t = useTranslations("pages.admin.analytics")
  return (
    <Card className="group relative overflow-hidden border-border transition-colors hover:border-border">
      <div className="flex items-center justify-between border-b border-border p-5">
        <h2 className="text-base font-medium text-foreground">{t("regions.title")}</h2>
        <Button
          variant="ghost"
          size="sm"
          className="h-auto p-0 text-xs font-medium text-muted-foreground hover:bg-transparent hover:text-foreground"
        >
          {t("regions.viewAll")}
        </Button>
      </div>
      <CardContent className="space-y-5 p-5">
        {regions.map((region) => (
          <AnalyticsRegionRow key={region.name} region={region} />
        ))}
      </CardContent>
    </Card>
  )
}

const AnalyticsRegionRow = ({ region }: { readonly region: AdminAnalyticsRegionRow }): JSX.Element => (
  <div>
    <div className="mb-2 flex items-center justify-between text-sm">
      <span className="flex items-center gap-2 font-medium text-foreground">
        {region.flag} {region.name}
      </span>
      <span className="text-muted-foreground">
        {region.percentage}
        <span aria-hidden="true">%</span>
      </span>
    </div>
    <div className="h-1.5 w-full overflow-hidden rounded-full bg-secondary">
      <RegionProgressBar percentage={region.percentage} />
    </div>
  </div>
)
