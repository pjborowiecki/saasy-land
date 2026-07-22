import type { JSX } from "react"

import { getTranslations } from "next-intl/server"

import { Button } from "~/src/presentation/components/shadcn/button"
import { Card } from "~/src/presentation/components/shadcn/card"

import type { AdminAnalyticsUpgradeRow } from "~/src/app/[locale]/(admin)/admin/_types"

interface AnalyticsUpgradesCardProps {
  readonly upgrades: readonly AdminAnalyticsUpgradeRow[]
}

export async function AnalyticsUpgradesCard({ upgrades }: AnalyticsUpgradesCardProps): Promise<JSX.Element> {
  const t = await getTranslations("pages.admin.analytics")
  return (
    <Card className="group relative overflow-hidden border-border/80 transition-colors hover:border-border/40">
      <div className="flex items-center justify-between border-b border-border/40 p-5">
        <h2 className="text-base font-medium text-foreground">{t("upgrades.title")}</h2>
        <Button
          variant="ghost"
          size="sm"
          className="h-auto p-0 text-xs font-medium text-muted-foreground hover:bg-transparent hover:text-foreground"
        >
          {t("upgrades.viewAll")}
        </Button>
      </div>
      <div className="divide-y divide-border/40">
        {upgrades.map((upgrade) => (
          <AnalyticsUpgradeRow key={upgrade.name} upgrade={upgrade} />
        ))}
      </div>
    </Card>
  )
}

function AnalyticsUpgradeRow({ upgrade }: { readonly upgrade: AdminAnalyticsUpgradeRow }): JSX.Element {
  return (
    <div className="flex items-center justify-between p-4 transition-colors hover:bg-secondary/20">
      <div className="flex items-center gap-3">
        <div
          className={`flex size-8 shrink-0 items-center justify-center rounded-full bg-gradient-to-tr text-xs font-medium text-white ${upgrade.colors}`}
        >
          {upgrade.initials}
        </div>
        <div>
          <p className="text-sm font-medium text-foreground">{upgrade.name}</p>
          <p className="text-xs text-muted-foreground">{upgrade.action}</p>
        </div>
      </div>
      <span className="text-xs text-muted-foreground">{upgrade.time}</span>
    </div>
  )
}
