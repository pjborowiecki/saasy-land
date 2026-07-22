import type { JSX } from "react"

import { getTranslations } from "next-intl/server"

import { Button } from "~/src/presentation/components/shadcn/button"
import { Card, CardContent } from "~/src/presentation/components/shadcn/card"

import { RegionProgressBar } from "~/src/app/[locale]/(admin)/admin/_components/region-progress-bar"
import type { AdminAnalyticsRegionRow } from "~/src/app/[locale]/(admin)/admin/_types"

interface AnalyticsRegionsCardProps {
  readonly regions: readonly AdminAnalyticsRegionRow[]
}

export async function AnalyticsRegionsCard({ regions }: AnalyticsRegionsCardProps): Promise<JSX.Element> {
  const t = await getTranslations("pages.admin.analytics")
  return (
    <Card className="group relative overflow-hidden border-border/80 transition-colors hover:border-border/40">
      <div className="flex items-center justify-between border-b border-border/40 p-5">
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

function AnalyticsRegionRow({ region }: { readonly region: AdminAnalyticsRegionRow }): JSX.Element {
  return (
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
}
