import type { Metadata } from "next"
import type { JSX } from "react"

import {
  AlertTriangle,
  ArrowDownUp,
  Calendar,
  Download,
  Filter,
  Laptop,
  PenLine,
  PlusCircle,
  Search,
  ShieldCheck,
  Smartphone,
  Trash2,
  TrendingDown,
  TrendingUp,
  Users,
  Wallet,
} from "lucide-react"
import { getTranslations } from "next-intl/server"

import { Avatar, AvatarFallback, AvatarImage } from "~/src/components/shadcn/avatar"
import { Badge } from "~/src/components/shadcn/badge"
import { Button } from "~/src/components/shadcn/button"
import { Card, CardContent, CardHeader, CardTitle } from "~/src/components/shadcn/card"
import { Checkbox } from "~/src/components/shadcn/checkbox"
import { Input } from "~/src/components/shadcn/input"
import { Switch } from "~/src/components/shadcn/switch"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "~/src/components/shadcn/table"

export async function generateMetadata({ params }: Readonly<PageProps<"/[locale]/admin">>): Promise<Metadata> {
  const { locale } = await params
  const t = await getTranslations({ locale, namespace: "admin.dashboard" })

  return {
    title: t("title"),
    description: t("description"),
  }
}

export default async function AppPage({ params }: Readonly<PageProps<"/[locale]/admin">>): Promise<JSX.Element> {
  const { locale } = await params
  const t = await getTranslations({ locale, namespace: "admin.dashboard" })

  const users = t.raw("users.table.rows") as Array<{
    id: number
    name: string
    email: string
    avatar?: string
    initials?: string
    role: string
    status: string
    lastActive: string
  }>

  const sessions = t.raw("sessions.items") as Array<{
    id: number
    device: string
    location: string
    icon: string
    isCurrent: boolean
  }>

  return (
    <div className="fade-in-50 flex w-full animate-in flex-col space-y-8 pb-8 duration-500">
      {/* Page Title & Actions */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h1 className="mb-1 font-medium text-2xl text-foreground tracking-tight">{t("title")}</h1>
          <p className="text-muted-foreground text-sm">{t("description")}</p>
        </div>
        <div className="flex items-center gap-3">
          <Button variant="outline" className="h-9 gap-2">
            <Calendar className="size-4 text-muted-foreground" />
            {t("actions.last30Days")}
          </Button>
          <Button className="h-9 gap-2 shadow-sm">
            <PlusCircle className="size-4" />
            {t("actions.addProduct")}
          </Button>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {/* Stat 1 */}
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
            <p className="mb-1 font-medium text-muted-foreground text-sm">{t("stats.revenue.title")}</p>
            <h3 className="font-medium text-2xl text-foreground tracking-tight">{t("stats.revenue.value")}</h3>
          </CardContent>
        </Card>

        {/* Stat 2 */}
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
            <p className="mb-1 font-medium text-muted-foreground text-sm">{t("stats.activeUsers.title")}</p>
            <h3 className="font-medium text-2xl text-foreground tracking-tight">{t("stats.activeUsers.value")}</h3>
          </CardContent>
        </Card>

        {/* Stat 3 */}
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
            <p className="mb-1 font-medium text-muted-foreground text-sm">{t("stats.currentSessions.title")}</p>
            <h3 className="font-medium text-2xl text-foreground tracking-tight">{t("stats.currentSessions.value")}</h3>
          </CardContent>
        </Card>

        {/* Stat 4 */}
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
            <p className="mb-1 font-medium text-muted-foreground text-sm">{t("stats.churnRate.title")}</p>
            <h3 className="font-medium text-2xl text-foreground tracking-tight">{t("stats.churnRate.value")}</h3>
          </CardContent>
        </Card>
      </div>

      {/* Revenue Chart */}
      <Card className="group relative overflow-hidden border-border/80 p-5 transition-colors hover:border-border/40">
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-secondary/50 to-transparent opacity-100 transition-opacity group-hover:opacity-0" />
        <div className="mb-8 flex items-center justify-between">
          <div>
            <h2 className="mb-1 font-medium text-base text-foreground">{t("chart.title")}</h2>
            <p className="text-muted-foreground text-xs">{t("chart.description")}</p>
          </div>
          <div className="flex items-center gap-1 rounded-lg border border-border/50 bg-secondary/50 p-1">
            <Button variant="secondary" size="sm" className="h-7 px-3 text-xs shadow-sm">
              {t("chart.filters.12m")}
            </Button>
            <Button variant="ghost" size="sm" className="h-7 px-3 text-muted-foreground text-xs hover:text-foreground">
              {t("chart.filters.30d")}
            </Button>
            <Button variant="ghost" size="sm" className="h-7 px-3 text-muted-foreground text-xs hover:text-foreground">
              {t("chart.filters.7d")}
            </Button>
          </div>
        </div>

        <div className="relative h-[280px] w-full">
          {/* Y-axis labels */}
          <div className="absolute top-0 bottom-6 left-0 flex flex-col justify-between font-medium text-muted-foreground text-xs">
            {(t.raw("chart.yAxis") as string[]).map((label) => (
              <span key={label}>{label}</span>
            ))}
          </div>

          {/* Grid lines */}
          <div className="absolute top-2 right-0 bottom-8 left-10 flex flex-col justify-between">
            <div className="h-px w-full bg-border/40"></div>
            <div className="h-px w-full bg-border/40"></div>
            <div className="h-px w-full bg-border/40"></div>
            <div className="h-px w-full bg-border/40"></div>
          </div>

          {/* SVG Chart Area */}
          <div className="absolute top-2 right-0 bottom-8 left-10">
            <svg viewBox="0 0 1000 240" preserveAspectRatio="none" className="h-full w-full overflow-visible">
              <title>{t("chart.title")}</title>
              <defs>
                <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="var(--primary)" stopOpacity="0.3"></stop>
                  <stop offset="95%" stopColor="var(--primary)" stopOpacity="0"></stop>
                </linearGradient>
              </defs>
              <path
                d="M0,180 C100,150 200,200 300,120 C400,60 500,130 600,100 C700,80 800,160 900,60 L1000,40 L1000,240 L0,240 Z"
                fill="url(#colorRevenue)"
              ></path>
              <path
                d="M0,180 C100,150 200,200 300,120 C400,60 500,130 600,100 C700,80 800,160 900,60 L1000,40"
                fill="none"
                stroke="var(--primary)"
                strokeWidth="2.5"
                vectorEffect="non-scaling-stroke"
              ></path>
              <circle
                cx="900"
                cy="60"
                r="4"
                fill="var(--background)"
                stroke="var(--primary)"
                strokeWidth="2"
                className="cursor-pointer"
              ></circle>
            </svg>
          </div>

          {/* X-axis labels */}
          <div className="absolute right-0 bottom-0 left-10 flex justify-between font-medium text-muted-foreground text-xs">
            {(t.raw("chart.xAxis") as string[]).map((label) => (
              <span key={label}>{label}</span>
            ))}
          </div>
        </div>
      </Card>

      {/* Main Widgets Grid */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        {/* Left Col: Advanced Table */}
        <div className="space-y-6 lg:col-span-2">
          <Card className="group relative flex flex-col overflow-hidden border-border/80 transition-colors hover:border-border/40">
            <CardHeader className="flex flex-row items-center justify-between border-border/40 border-b p-5">
              <div>
                <CardTitle className="mb-1 font-medium text-base text-foreground">{t("users.title")}</CardTitle>
                <p className="text-muted-foreground text-xs">{t("users.description")}</p>
              </div>
            </CardHeader>

            {/* Table Toolbar */}
            <div className="flex flex-col justify-between gap-4 border-border/40 border-b bg-secondary/20 p-4 sm:flex-row sm:items-center">
              <div className="flex items-center gap-3">
                <div className="relative w-48">
                  <Search className="absolute top-1/2 left-2.5 size-4 -translate-y-1/2 text-muted-foreground" />
                  <Input placeholder={t("users.search")} className="h-8 pl-8 text-xs" />
                </div>
                <Button variant="outline" size="sm" className="h-8 gap-1.5 px-2.5 text-xs">
                  <Filter className="size-3.5" />
                  {t("users.filters.role")}
                </Button>
                <Button variant="outline" size="sm" className="h-8 gap-1.5 px-2.5 text-xs">
                  <ArrowDownUp className="size-3.5" />
                  {t("users.filters.status")}
                </Button>
              </div>
              <div className="flex items-center gap-2">
                <Button variant="outline" size="sm" className="h-8 gap-1.5 px-3 text-xs">
                  <Download className="size-3.5" />
                  {t("users.export")}
                </Button>
              </div>
            </div>

            {/* Data Table */}
            <div className="custom-scrollbar w-full overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-12 text-center">
                      <Checkbox />
                    </TableHead>
                    <TableHead>{t("users.table.columns.user")}</TableHead>
                    <TableHead>{t("users.table.columns.role")}</TableHead>
                    <TableHead>{t("users.table.columns.status")}</TableHead>
                    <TableHead>{t("users.table.columns.lastActive")}</TableHead>
                    <TableHead className="text-right">{t("users.table.columns.actions")}</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {users.map((row) => (
                    <TableRow key={row.id} className="group">
                      <TableCell className="text-center">
                        <Checkbox />
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-3">
                          <Avatar className="size-8 border border-border/50">
                            <AvatarImage src={row.avatar} alt={row.name} />
                            <AvatarFallback className="bg-primary/10 font-medium text-primary text-xs">
                              {row.initials ?? row.name.slice(0, 2).toUpperCase()}
                            </AvatarFallback>
                          </Avatar>
                          <div>
                            <p className="font-medium text-foreground">{row.name}</p>
                            <p className="text-muted-foreground text-xs">{row.email}</p>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge variant="outline" className="font-medium text-muted-foreground">
                          {row.role}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <div
                            className={`size-2 rounded-full ${
                              row.status === "Online"
                                ? "bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.4)]"
                                : row.status === "Idle"
                                  ? "bg-amber-500"
                                  : "bg-muted-foreground"
                            }`}
                          />
                          <span className="text-muted-foreground text-xs">{row.status}</span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <span className="text-muted-foreground text-xs">{row.lastActive}</span>
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex items-center justify-end gap-2 opacity-0 transition-opacity group-hover:opacity-100">
                          <Button variant="ghost" size="icon" className="size-7">
                            <PenLine className="size-4 text-muted-foreground" />
                          </Button>
                          <Button variant="ghost" size="icon" className="size-7 hover:bg-destructive/10 hover:text-destructive">
                            <Trash2 className="size-4 text-muted-foreground" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
            <div className="flex items-center justify-between border-border/40 border-t p-4 text-muted-foreground text-xs">
              <span>{t("users.table.pagination.showing")}</span>
              <div className="flex items-center gap-2">
                <Button variant="outline" size="sm" className="h-7 px-2" disabled>
                  {t("users.table.pagination.previous")}
                </Button>
                <Button variant="outline" size="sm" className="h-7 px-2">
                  {t("users.table.pagination.next")}
                </Button>
              </div>
            </div>
          </Card>
        </div>

        {/* Right Col: Sessions & Settings */}
        <div className="space-y-6">
          {/* Active Sessions */}
          <Card className="group relative overflow-hidden border-border/80 transition-colors hover:border-border/40">
            <CardHeader className="border-border/40 border-b p-5">
              <CardTitle className="font-medium text-base text-foreground">{t("sessions.title")}</CardTitle>
            </CardHeader>
            <CardContent className="p-2">
              {sessions.map((session) => (
                <div
                  key={session.id}
                  className="group flex items-center justify-between rounded-lg p-3 transition-colors hover:bg-secondary/50"
                >
                  <div className="flex items-center gap-3">
                    <div className="flex size-10 items-center justify-center rounded-lg border border-border/50 bg-secondary text-muted-foreground">
                      {session.icon === "laptop" ? <Laptop className="size-5" /> : <Smartphone className="size-5" />}
                    </div>
                    <div>
                      <p className="flex items-center gap-2 font-medium text-foreground text-sm">
                        {session.device}
                        {session.isCurrent && (
                          <Badge
                            variant="outline"
                            className="border-primary/20 bg-primary/10 px-1.5 py-0.5 font-medium text-[10px] text-primary"
                          >
                            {t("sessions.current")}
                          </Badge>
                        )}
                      </p>
                      <p className="text-muted-foreground text-xs">{session.location}</p>
                    </div>
                  </div>
                  {!session.isCurrent && (
                    <Button
                      variant="ghost"
                      size="sm"
                      className="h-6 px-2 font-medium text-destructive text-xs opacity-0 transition-opacity hover:bg-destructive/10 hover:text-destructive group-hover:opacity-100"
                    >
                      {t("sessions.revoke")}
                    </Button>
                  )}
                </div>
              ))}
            </CardContent>
            <div className="border-border/40 border-t bg-secondary/20 p-3">
              <Button variant="ghost" className="h-auto w-full py-1 font-medium text-muted-foreground text-xs hover:text-foreground">
                {t("sessions.signoutAll")}
              </Button>
            </div>
          </Card>

          {/* Security Settings */}
          <Card className="group relative overflow-hidden border-border/80 p-5 transition-colors hover:border-border/40">
            <h2 className="mb-4 font-medium text-base text-foreground">{t("security.title")}</h2>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium text-foreground text-sm">{t("security.mfa")}</p>
                  <p className="text-muted-foreground text-xs">{t("security.mfaDesc")}</p>
                </div>
                <Switch defaultChecked />
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium text-foreground text-sm">{t("security.email")}</p>
                  <p className="text-muted-foreground text-xs">{t("security.emailDesc")}</p>
                </div>
                <Switch />
              </div>
            </div>
          </Card>
        </div>
      </div>
    </div>
  )
}
