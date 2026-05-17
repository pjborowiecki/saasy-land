import type { Metadata } from "next"
import type { JSX } from "react"

import { ArrowDownRight, ArrowUpRight, Calendar, ChevronDown, CircleDollarSign, Tag, UserMinus, Users } from "lucide-react"
import { getTranslations } from "next-intl/server"

import { Badge } from "~/src/components/shadcn/badge"
import { Button } from "~/src/components/shadcn/button"
import { Card, CardContent } from "~/src/components/shadcn/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "~/src/components/shadcn/tabs"

export async function generateMetadata({ params }: Readonly<PageProps<"/[locale]/admin">>): Promise<Metadata> {
  const { locale } = await params
  const t = await getTranslations({ locale, namespace: "admin.analytics" })

  return {
    title: t("metadata.title"),
    description: t("metadata.description"),
  }
}

export default async function AnalyticsPage({ params }: Readonly<PageProps<"/[locale]/admin">>): Promise<JSX.Element> {
  const { locale } = await params
  const t = await getTranslations({ locale, namespace: "admin.analytics" })

  return (
    <div className="fade-in-50 flex w-full animate-in flex-col space-y-8 duration-500">
      {/* Page Title & Actions */}
      <div className="flex flex-col gap-4">
        <div>
          <h1 className="mb-1 font-medium text-2xl text-foreground tracking-tight">{t("title")}</h1>
          <p className="text-muted-foreground text-sm">{t("description")}</p>
        </div>
      </div>

      <Tabs defaultValue="overview" className="w-full">
        {/* Tabs */}
        <div className="flex flex-col gap-4 border-border border-b sm:flex-row sm:items-center sm:justify-between">
          <TabsList variant="line" className="no-scrollbar flex-1 justify-start gap-6 overflow-x-auto">
            <TabsTrigger value="overview" className="flex-none px-0 text-sm">
              {t("tabs.overview")}
            </TabsTrigger>
            <TabsTrigger value="revenue" className="flex-none px-0 text-sm">
              {t("tabs.revenue")}
            </TabsTrigger>
            <TabsTrigger value="audience" className="flex-none px-0 text-sm">
              {t("tabs.audience")}
            </TabsTrigger>
            <TabsTrigger value="retention" className="flex-none px-0 text-sm">
              {t("tabs.retention")}
            </TabsTrigger>
            <TabsTrigger value="reports" className="flex-none px-0 text-sm">
              {t("tabs.reports")}
            </TabsTrigger>
          </TabsList>

          <div className="flex flex-wrap items-center gap-3 pb-3 sm:pb-0">
            <Button variant="outline" size="sm" className="h-9 gap-2">
              <Calendar className="size-4 text-muted-foreground" />
              {t("actions.datePicker")}
              <ChevronDown className="ml-1 size-4 text-muted-foreground" />
            </Button>
          </div>
        </div>

        {/* Tab Content */}
        <TabsContent value="overview" className="mt-8 space-y-6 outline-none">
          {/* KPI Cards Grid */}
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4 lg:gap-6">
            {/* KPI 1: MRR */}
            <Card className="group relative overflow-hidden border-border/80 transition-colors hover:border-border/40">
              <CardContent className="p-5">
                <div className="mb-4 flex items-start justify-between">
                  <span className="font-medium text-muted-foreground text-sm">{t("kpi.mrr.title")}</span>
                  <div className="flex size-8 items-center justify-center rounded-lg border border-border/50 bg-secondary text-muted-foreground">
                    <CircleDollarSign className="size-4" />
                  </div>
                </div>
                <div>
                  <h3 className="font-semibold text-3xl text-foreground tracking-tight">{t("kpi.mrr.value")}</h3>
                  <div className="mt-2 flex items-center gap-2">
                    <Badge
                      variant="outline"
                      className="border-emerald-500/20 bg-emerald-500/10 px-1.5 py-0.5 font-medium text-[10px] text-emerald-500"
                    >
                      <ArrowUpRight className="mr-1 size-3" /> {t("kpi.mrr.trend")}
                    </Badge>
                    <span className="text-muted-foreground text-xs">{t("kpi.mrr.trendLabel")}</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* KPI 2: Active Users */}
            <Card className="group relative overflow-hidden border-border/80 transition-colors hover:border-border/40">
              <CardContent className="p-5">
                <div className="mb-4 flex items-start justify-between">
                  <span className="font-medium text-muted-foreground text-sm">{t("kpi.activeUsers.title")}</span>
                  <div className="flex size-8 items-center justify-center rounded-lg border border-border/50 bg-secondary text-muted-foreground">
                    <Users className="size-4" />
                  </div>
                </div>
                <div>
                  <h3 className="font-semibold text-3xl text-foreground tracking-tight">{t("kpi.activeUsers.value")}</h3>
                  <div className="mt-2 flex items-center gap-2">
                    <Badge
                      variant="outline"
                      className="border-emerald-500/20 bg-emerald-500/10 px-1.5 py-0.5 font-medium text-[10px] text-emerald-500"
                    >
                      <ArrowUpRight className="mr-1 size-3" /> {t("kpi.activeUsers.trend")}
                    </Badge>
                    <span className="text-muted-foreground text-xs">{t("kpi.activeUsers.trendLabel")}</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* KPI 3: Churn Rate */}
            <Card className="group relative overflow-hidden border-border/80 transition-colors hover:border-border/40">
              <CardContent className="p-5">
                <div className="mb-4 flex items-start justify-between">
                  <span className="font-medium text-muted-foreground text-sm">{t("kpi.churn.title")}</span>
                  <div className="flex size-8 items-center justify-center rounded-lg border border-border/50 bg-secondary text-muted-foreground">
                    <UserMinus className="size-4" />
                  </div>
                </div>
                <div>
                  <h3 className="font-semibold text-3xl text-foreground tracking-tight">{t("kpi.churn.value")}</h3>
                  <div className="mt-2 flex items-center gap-2">
                    <Badge
                      variant="outline"
                      className="border-emerald-500/20 bg-emerald-500/10 px-1.5 py-0.5 font-medium text-[10px] text-emerald-500"
                    >
                      <ArrowDownRight className="mr-1 size-3" /> {t("kpi.churn.trend")}
                    </Badge>
                    <span className="text-muted-foreground text-xs">{t("kpi.churn.trendLabel")}</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* KPI 4: ARPU */}
            <Card className="group relative overflow-hidden border-border/80 transition-colors hover:border-border/40">
              <CardContent className="p-5">
                <div className="mb-4 flex items-start justify-between">
                  <span className="font-medium text-muted-foreground text-sm">{t("kpi.arpu.title")}</span>
                  <div className="flex size-8 items-center justify-center rounded-lg border border-border/50 bg-secondary text-muted-foreground">
                    <Tag className="size-4" />
                  </div>
                </div>
                <div>
                  <h3 className="font-semibold text-3xl text-foreground tracking-tight">{t("kpi.arpu.value")}</h3>
                  <div className="mt-2 flex items-center gap-2">
                    <Badge
                      variant="outline"
                      className="border-emerald-500/20 bg-emerald-500/10 px-1.5 py-0.5 font-medium text-[10px] text-emerald-500"
                    >
                      <ArrowUpRight className="mr-1 size-3" /> {t("kpi.arpu.trend")}
                    </Badge>
                    <span className="text-muted-foreground text-xs">{t("kpi.arpu.trendLabel")}</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Main Chart Area */}
          <Card className="group relative overflow-hidden border-border/80 transition-colors hover:border-border/40">
            <div className="flex flex-col gap-4 border-border/40 border-b p-5 sm:flex-row sm:items-center sm:justify-between lg:p-6">
              <div>
                <h2 className="font-medium text-base text-foreground">{t("chart.title")}</h2>
                <p className="mt-1 text-muted-foreground text-xs">{t("chart.description")}</p>
              </div>
              <div className="flex items-center gap-4 font-medium text-xs">
                <div className="flex items-center gap-2 text-foreground/80">
                  <span className="size-2.5 rounded-sm bg-primary" />
                  {t("chart.legend.new")}
                </div>
                <div className="flex items-center gap-2 text-muted-foreground">
                  <span className="size-2.5 rounded-sm bg-secondary" />
                  {t("chart.legend.renewals")}
                </div>
              </div>
            </div>

            <div className="relative flex h-72 flex-col p-6">
              {/* Y-Axis */}
              <div className="pointer-events-none absolute inset-y-6 right-6 left-6 z-0 flex flex-col justify-between">
                {["$4k", "$3k", "$2k", "$1k", "$0"].map((label) => (
                  <div key={label} className="flex w-full items-center justify-start border-border/20 border-t">
                    <span className="-mt-2 bg-card pr-2 text-muted-foreground text-xs">{label}</span>
                  </div>
                ))}
              </div>

              {/* Bars */}
              <div className="z-10 ml-8 flex flex-1 items-end gap-1 pt-4 pb-0.5 sm:gap-2">
                {[
                  { id: "1", height1: "45%", height2: "15%", label: "May 1: $2,400" },
                  { id: "2", height1: "35%", height2: "20%" },
                  { id: "3", height1: "60%", height2: "25%" },
                  { id: "4", height1: "50%", height2: "30%" },
                  { id: "5", height1: "40%", height2: "22%" },
                  { id: "6", height1: "70%", height2: "18%" },
                  { id: "7", height1: "85%", height2: "15%" },
                  { id: "8", height1: "55%", height2: "25%" },
                  { id: "9", height1: "45%", height2: "35%" },
                  { id: "10", height1: "30%", height2: "20%" },
                  { id: "11", height1: "65%", height2: "15%" },
                  { id: "12", height1: "75%", height2: "20%" },
                  { id: "13", height1: "90%", height2: "10%", active: true, label: "Today: $4,200" },
                  { id: "14", height1: "80%", height2: "12%" },
                  { id: "15", height1: "60%", height2: "25%" },
                  { id: "16", height1: "50%", height2: "35%" },
                  { id: "17", height1: "70%", height2: "20%" },
                  { id: "18", height1: "40%", height2: "15%" },
                ].map((bar) => (
                  <div key={bar.id} className="group relative flex h-full flex-1 flex-col justify-end">
                    <div
                      className={`w-full rounded-t-[2px] transition-all duration-300 ${bar.active ? "bg-primary shadow-[0_0_15px_rgba(232,121,249,0.3)]" : "bg-primary/80 group-hover:bg-primary"}`}
                      style={{ height: bar.height1 }}
                    />
                    <div
                      className={`w-full rounded-b-[2px] transition-all duration-300 ${bar.active ? "bg-primary/20" : "bg-secondary group-hover:bg-secondary/80"}`}
                      style={{ height: bar.height2 }}
                    />
                    {bar.label && (
                      <div
                        className={`absolute bottom-full left-1/2 z-20 mb-2 -translate-x-1/2 whitespace-nowrap rounded border px-2.5 py-1.5 text-xs shadow-xl ${bar.active ? "border-border/10 bg-foreground font-semibold text-background" : "hidden border-border/10 bg-secondary font-medium text-foreground group-hover:block"}`}
                      >
                        {bar.label}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </Card>

          {/* Bottom Two Columns */}
          <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
            {/* Top Regions Card */}
            <Card className="group relative overflow-hidden border-border/80 transition-colors hover:border-border/40">
              <div className="flex items-center justify-between border-border/40 border-b p-5">
                <h2 className="font-medium text-base text-foreground">{t("regions.title")}</h2>
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-auto p-0 font-medium text-muted-foreground text-xs hover:bg-transparent hover:text-foreground"
                >
                  {t("regions.viewAll")}
                </Button>
              </div>
              <CardContent className="space-y-5 p-5">
                {(
                  t.raw("regions.list") as {
                    name: string
                    flag: string
                    percentage: number
                  }[]
                ).map((region) => (
                  <div key={region.name}>
                    <div className="mb-2 flex items-center justify-between text-sm">
                      <span className="flex items-center gap-2 font-medium text-foreground">
                        {region.flag} {region.name}
                      </span>
                      <span className="text-muted-foreground">
                        {region.percentage}
                        {/* biome-ignore lint/style/noJsxLiterals: percent symbol */}%
                      </span>
                    </div>
                    <div className="h-1.5 w-full overflow-hidden rounded-full bg-secondary">
                      <div className="h-full rounded-full bg-primary" style={{ width: `${region.percentage}%` }} />
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>

            {/* Recent Upgrades Card */}
            <Card className="group relative overflow-hidden border-border/80 transition-colors hover:border-border/40">
              <div className="flex items-center justify-between border-border/40 border-b p-5">
                <h2 className="font-medium text-base text-foreground">{t("upgrades.title")}</h2>
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-auto p-0 font-medium text-muted-foreground text-xs hover:bg-transparent hover:text-foreground"
                >
                  {t("upgrades.viewAll")}
                </Button>
              </div>
              <div className="divide-y divide-border/40">
                {(
                  t.raw("upgrades.list") as {
                    initials: string
                    name: string
                    action: string
                    time: string
                    colors: string
                  }[]
                ).map((upgrade) => (
                  <div key={upgrade.name} className="flex items-center justify-between p-4 transition-colors hover:bg-secondary/20">
                    <div className="flex items-center gap-3">
                      <div
                        className={`flex size-8 shrink-0 items-center justify-center rounded-full bg-gradient-to-tr font-medium text-white text-xs ${upgrade.colors}`}
                      >
                        {upgrade.initials}
                      </div>
                      <div>
                        <p className="font-medium text-foreground text-sm">{upgrade.name}</p>
                        <p className="text-muted-foreground text-xs">{upgrade.action}</p>
                      </div>
                    </div>
                    <span className="text-muted-foreground text-xs">{upgrade.time}</span>
                  </div>
                ))}
              </div>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}
