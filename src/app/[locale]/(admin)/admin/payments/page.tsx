import type { Metadata } from "next"
import type { JSX } from "react"

import { Clock, CreditCard, Download, Filter, MoreHorizontal, Settings, TrendingDown } from "lucide-react"
import { getTranslations } from "next-intl/server"

import { Button } from "~/src/components/shadcn/button"
import { Card, CardContent, CardHeader, CardTitle } from "~/src/components/shadcn/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "~/src/components/shadcn/table"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "~/src/components/shadcn/tabs"

export async function generateMetadata({ params }: Readonly<PageProps<"/[locale]/admin">>): Promise<Metadata> {
  const { locale } = await params
  const t = await getTranslations({ locale, namespace: "admin.payments" })

  return {
    title: t("metadata.title"),
    description: t("metadata.description"),
  }
}

export default async function PaymentsPage({ params }: Readonly<PageProps<"/[locale]/admin">>): Promise<JSX.Element> {
  const { locale } = await params
  const t = await getTranslations({ locale, namespace: "admin.payments" })

  return (
    <div className="fade-in-50 flex w-full animate-in flex-col space-y-8 duration-500">
      <div className="flex flex-col gap-4">
        <div>
          <h1 className="font-medium text-2xl text-foreground tracking-tight">{t("title")}</h1>
          <p className="mt-1 text-muted-foreground text-sm">{t("description")}</p>
        </div>
      </div>

      <Tabs defaultValue="refunds" className="w-full">
        {/* Tabs and Actions */}
        <div className="flex flex-col gap-4 border-border border-b sm:flex-row sm:items-center sm:justify-between">
          <TabsList variant="line" className="no-scrollbar flex-1 justify-start gap-6 overflow-x-auto">
            <TabsTrigger value="transactions" className="flex-none px-0 text-sm">
              {t("tabs.transactions")}
            </TabsTrigger>
            <TabsTrigger value="subscriptions" className="flex-none px-0 text-sm">
              {t("tabs.subscriptions")}
            </TabsTrigger>
            <TabsTrigger value="payouts" className="flex-none px-0 text-sm">
              {t("tabs.payouts")}
            </TabsTrigger>
            <TabsTrigger value="refunds" className="flex-none px-0 text-sm">
              {t("tabs.refunds")}
            </TabsTrigger>
          </TabsList>

          <div className="flex flex-wrap items-center gap-3 pb-3 sm:pb-0">
            <Button variant="outline" size="sm" className="h-9 gap-2">
              <Download className="size-4" />
              {t("actions.export")}
            </Button>
            <Button size="sm" className="h-9 gap-2">
              <Settings className="size-4" />
              {t("actions.settings")}
            </Button>
          </div>
        </div>

        <TabsContent value="refunds" className="mt-6 space-y-6">
          {/* Stats Grid */}
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-3 sm:gap-6">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="font-medium text-muted-foreground text-xs">{t("stats.refunded.title")}</CardTitle>
                <CreditCard className="size-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="font-medium text-2xl tracking-tight">{t("stats.refunded.value")}</div>
                <div className="mt-2 flex items-center gap-1.5 font-medium text-emerald-500 text-xs dark:text-emerald-400">
                  <TrendingDown className="size-3.5" />
                  <span>{t("stats.refunded.trend")}</span>
                  <span className="ml-1 text-muted-foreground">{t("stats.vsLastMonth")}</span>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="font-medium text-muted-foreground text-xs">{t("stats.refundRate.title")}</CardTitle>
                <TrendingDown className="size-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="font-medium text-2xl tracking-tight">{t("stats.refundRate.value")}</div>
                <div className="mt-2 flex items-center gap-1.5 font-medium text-emerald-500 text-xs dark:text-emerald-400">
                  <TrendingDown className="size-3.5" />
                  <span>{t("stats.refundRate.trend")}</span>
                  <span className="ml-1 text-muted-foreground">{t("stats.vsLastMonth")}</span>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="font-medium text-muted-foreground text-xs">{t("stats.pending.title")}</CardTitle>
                <Clock className="size-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="font-medium text-2xl tracking-tight">{t("stats.pending.value")}</div>
                <div className="mt-2 flex items-center gap-1.5 font-medium text-muted-foreground text-xs">
                  <span>{t("stats.pending.subtitle")}</span>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Refunds Table */}
          <Card className="overflow-hidden">
            <div className="flex items-center justify-between border-border/40 border-b px-5 py-4">
              <h2 className="font-medium text-base text-foreground">{t("table.title")}</h2>
              <Button variant="ghost" size="icon" className="size-8 text-muted-foreground">
                <Filter className="size-4" />
              </Button>
            </div>

            <div className="custom-scrollbar w-full overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>{t("table.columns.customer")}</TableHead>
                    <TableHead>{t("table.columns.amount")}</TableHead>
                    <TableHead>{t("table.columns.item")}</TableHead>
                    <TableHead>{t("table.columns.reason")}</TableHead>
                    <TableHead>{t("table.columns.date")}</TableHead>
                    <TableHead>{t("table.columns.status")}</TableHead>
                    <TableHead className="w-[50px]"></TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {(
                    t.raw("table.rows") as Array<{
                      id: number
                      initials: string
                      name: string
                      email: string
                      amount: string
                      type: string
                      item: string
                      reason: string
                      date: string
                      status: string
                      statusColor: string
                      statusTextColor: string
                    }>
                  ).map((row) => (
                    <TableRow key={row.id} className="group">
                      <TableCell className="py-3.5">
                        <div className="flex items-center gap-3">
                          <div className="flex size-7 shrink-0 items-center justify-center rounded-full border border-border/50 bg-secondary font-medium text-foreground text-xs">
                            {row.initials}
                          </div>
                          <div className="flex flex-col">
                            <span className="font-medium text-sm">{row.name}</span>
                            <span className="text-muted-foreground text-xs">{row.email}</span>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell className="py-3.5">
                        <div className="flex flex-col">
                          <span className="font-medium text-sm">{row.amount}</span>
                          <span className="text-muted-foreground text-xs">{row.type}</span>
                        </div>
                      </TableCell>
                      <TableCell className="py-3.5 text-sm">{row.item}</TableCell>
                      <TableCell className="py-3.5 text-muted-foreground text-sm">{row.reason}</TableCell>
                      <TableCell className="py-3.5 text-muted-foreground text-sm">{row.date}</TableCell>
                      <TableCell className="py-3.5">
                        <div className="flex items-center gap-2">
                          <div className={`size-1.5 rounded-full ${row.statusColor}`} />
                          <span className={`text-sm ${row.statusTextColor}`}>{row.status}</span>
                        </div>
                      </TableCell>
                      <TableCell className="py-3.5 text-right">
                        <Button variant="ghost" size="icon" className="size-7 opacity-0 transition-opacity group-hover:opacity-100">
                          <MoreHorizontal className="size-4 text-muted-foreground" />
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>

            {/* Pagination */}
            <div className="flex items-center justify-between border-border/40 border-t px-5 py-3 text-muted-foreground text-xs">
              <span>{t("table.pagination.showing")}</span>
              <div className="flex items-center gap-1">
                <Button variant="outline" size="sm" className="h-8 px-2.5 text-xs" disabled>
                  {t("table.pagination.previous")}
                </Button>
                <Button variant="secondary" size="icon" className="size-8 font-medium text-xs">
                  {t("table.pagination.page1")}
                </Button>
                <Button variant="outline" size="icon" className="size-8 text-xs">
                  {t("table.pagination.page2")}
                </Button>
                <span className="px-1">{t("table.pagination.ellipsis")}</span>
                <Button variant="outline" size="sm" className="h-8 px-2.5 text-xs">
                  {t("table.pagination.next")}
                </Button>
              </div>
            </div>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
