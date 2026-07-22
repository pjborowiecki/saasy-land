import type { JSX } from "react"

import { AlertTriangle, ShieldCheck, TrendingDown, TrendingUp, Users, Wallet } from "lucide-react"
import { getTranslations } from "next-intl/server"

import { Badge } from "~/src/presentation/components/shadcn/badge"
import { Card, CardContent, CardHeader } from "~/src/presentation/components/shadcn/card"

export async function DashboardStatsGrid(): Promise<JSX.Element> {
  const t = await getTranslations("pages.admin.dashboard")
  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
      <Card className="group relative overflow-hidden border-border/80 transition-colors hover:border-border/40">
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-secondary/50 to-transparent opacity-100 transition-opacity group-hover:opacity-0" />
        <CardHeader className="flex flex-row items-center justify-between pb-2">
          <div className="flex size-8 items-center justify-center rounded-lg border border-border/50 bg-secondary">
            <Wallet className="size-4 text-muted-foreground" />
          </div>
          <Badge variant="outline" className="gap-1 border-emerald-500/20 bg-emerald-500/10 text-emerald-500">
            <TrendingUp className="size-3" />
            {t("stats.revenue.trend")}
          </Badge>
        </CardHeader>
        <CardContent>
          <p className="mb-1 text-sm font-medium text-muted-foreground">{t("stats.revenue.title")}</p>
          <h3 className="text-2xl font-medium tracking-tight text-foreground">{t("stats.revenue.value")}</h3>
        </CardContent>
      </Card>

      <Card className="group relative overflow-hidden border-border/80 transition-colors hover:border-border/40">
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-secondary/50 to-transparent opacity-100 transition-opacity group-hover:opacity-0" />
        <CardHeader className="flex flex-row items-center justify-between pb-2">
          <div className="flex size-8 items-center justify-center rounded-lg border border-border/50 bg-secondary">
            <Users className="size-4 text-muted-foreground" />
          </div>
          <Badge variant="outline" className="gap-1 border-emerald-500/20 bg-emerald-500/10 text-emerald-500">
            <TrendingUp className="size-3" />
            {t("stats.activeUsers.trend")}
          </Badge>
        </CardHeader>
        <CardContent>
          <p className="mb-1 text-sm font-medium text-muted-foreground">{t("stats.activeUsers.title")}</p>
          <h3 className="text-2xl font-medium tracking-tight text-foreground">{t("stats.activeUsers.value")}</h3>
        </CardContent>
      </Card>

      <Card className="group relative overflow-hidden border-border/80 transition-colors hover:border-border/40">
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-secondary/50 to-transparent opacity-100 transition-opacity group-hover:opacity-0" />
        <CardHeader className="flex flex-row items-center justify-between pb-2">
          <div className="flex size-8 items-center justify-center rounded-lg border border-border/50 bg-secondary">
            <ShieldCheck className="size-4 text-muted-foreground" />
          </div>
          <Badge variant="secondary" className="gap-1">
            {t("stats.currentSessions.badge")}
          </Badge>
        </CardHeader>
        <CardContent>
          <p className="mb-1 text-sm font-medium text-muted-foreground">{t("stats.currentSessions.title")}</p>
          <h3 className="text-2xl font-medium tracking-tight text-foreground">{t("stats.currentSessions.value")}</h3>
        </CardContent>
      </Card>

      <Card className="group relative overflow-hidden border-border/80 transition-colors hover:border-border/40">
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-secondary/50 to-transparent opacity-100 transition-opacity group-hover:opacity-0" />
        <CardHeader className="flex flex-row items-center justify-between pb-2">
          <div className="flex size-8 items-center justify-center rounded-lg border border-border/50 bg-secondary">
            <AlertTriangle className="size-4 text-muted-foreground" />
          </div>
          <Badge variant="outline" className="gap-1 border-rose-500/20 bg-rose-500/10 text-rose-500">
            <TrendingDown className="size-3" />
            {t("stats.churnRate.trend")}
          </Badge>
        </CardHeader>
        <CardContent>
          <p className="mb-1 text-sm font-medium text-muted-foreground">{t("stats.churnRate.title")}</p>
          <h3 className="text-2xl font-medium tracking-tight text-foreground">{t("stats.churnRate.value")}</h3>
        </CardContent>
      </Card>
    </div>
  )
}
