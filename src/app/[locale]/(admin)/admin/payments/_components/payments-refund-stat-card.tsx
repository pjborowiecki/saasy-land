import type { JSX } from "react"

import type { LucideIcon } from "lucide-react"
import { getTranslations } from "next-intl/server"

import { Card, CardContent, CardHeader, CardTitle } from "~/src/components/shadcn/card"

interface PaymentsRefundStatCardProps {
  readonly icon: LucideIcon
  readonly statKey: "refunded" | "refundRate" | "pending"
  readonly trendIcon?: LucideIcon
}

export async function PaymentsRefundStatCard({
  icon: Icon,
  statKey,
  trendIcon: TrendIcon,
}: PaymentsRefundStatCardProps): Promise<JSX.Element> {
  const t = await getTranslations("pages.admin.payments")
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle className="text-xs font-medium text-muted-foreground">{t(`stats.${statKey}.title`)}</CardTitle>
        <Icon className="size-4 text-muted-foreground" />
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-medium tracking-tight">{t(`stats.${statKey}.value`)}</div>
        <PaymentsRefundStatTrend statKey={statKey} trendIcon={TrendIcon} />
      </CardContent>
    </Card>
  )
}

async function PaymentsRefundStatTrend({
  statKey,
  trendIcon: TrendIcon,
}: {
  readonly statKey: PaymentsRefundStatCardProps["statKey"]
  readonly trendIcon: LucideIcon | undefined
}): Promise<JSX.Element> {
  const t = await getTranslations("pages.admin.payments")

  if (statKey === "pending") {
    return (
      <div className="mt-2 flex items-center gap-1.5 text-xs font-medium text-muted-foreground">
        <span>{t("stats.pending.subtitle")}</span>
      </div>
    )
  }

  return (
    <div className="mt-2 flex items-center gap-1.5 text-xs font-medium text-emerald-500 dark:text-emerald-400">
      {TrendIcon !== undefined && <TrendIcon className="size-3.5" />}
      <span>{t(`stats.${statKey}.trend`)}</span>
      <span className="ml-1 text-muted-foreground">{t("stats.vsLastMonth")}</span>
    </div>
  )
}
