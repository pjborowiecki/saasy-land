import type { JSX } from "react"

import { AlertTriangle, Package, Users } from "lucide-react"
import { getTranslations } from "next-intl/server"

import { getProducts } from "~/src/modules/product/use-cases/list-products.use-case"
import { listUsers } from "~/src/modules/user/use-cases/list-users.use-case"

import { Card, CardContent, CardHeader } from "~/src/presentation/components/shadcn/card"

export async function DashboardStatsGrid(): Promise<JSX.Element> {
  const [usersResult, products, t] = await Promise.all([listUsers(), getProducts(), getTranslations("pages.admin.dashboard")])
  const userRows = usersResult.data ?? []

  const pendingVerificationCount = userRows.filter((row) => !row.emailVerified && !row.banned).length

  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
      <Card className="group relative overflow-hidden border-border/80 transition-colors hover:border-border/40">
        <div className="pointer-events-none absolute inset-0 bg-linear-to-b from-secondary/50 to-transparent opacity-100 transition-opacity group-hover:opacity-0" />
        <CardHeader className="flex flex-row items-center justify-between pb-2">
          <div className="flex size-8 items-center justify-center rounded-lg border border-border/50 bg-secondary">
            <Users className="size-4 text-muted-foreground" />
          </div>
        </CardHeader>
        <CardContent>
          <p className="mb-1 text-sm font-medium text-muted-foreground">{t("stats.activeUsers.title")}</p>
          <h3 className="text-2xl font-medium tracking-tight text-foreground">{userRows.length}</h3>
        </CardContent>
      </Card>

      <Card className="group relative overflow-hidden border-border/80 transition-colors hover:border-border/40">
        <div className="pointer-events-none absolute inset-0 bg-linear-to-b from-secondary/50 to-transparent opacity-100 transition-opacity group-hover:opacity-0" />
        <CardHeader className="flex flex-row items-center justify-between pb-2">
          <div className="flex size-8 items-center justify-center rounded-lg border border-border/50 bg-secondary">
            <Package className="size-4 text-muted-foreground" />
          </div>
        </CardHeader>
        <CardContent>
          <p className="mb-1 text-sm font-medium text-muted-foreground">{t("stats.totalProducts.title")}</p>
          <h3 className="text-2xl font-medium tracking-tight text-foreground">{products.length}</h3>
        </CardContent>
      </Card>

      <Card className="group relative overflow-hidden border-border/80 transition-colors hover:border-border/40">
        <div className="pointer-events-none absolute inset-0 bg-linear-to-b from-secondary/50 to-transparent opacity-100 transition-opacity group-hover:opacity-0" />
        <CardHeader className="flex flex-row items-center justify-between pb-2">
          <div className="flex size-8 items-center justify-center rounded-lg border border-border/50 bg-secondary">
            <AlertTriangle className="size-4 text-muted-foreground" />
          </div>
        </CardHeader>
        <CardContent>
          <p className="mb-1 text-sm font-medium text-muted-foreground">{t("stats.pendingVerification.title")}</p>
          <h3 className="text-2xl font-medium tracking-tight text-foreground">{pendingVerificationCount}</h3>
        </CardContent>
      </Card>
    </div>
  )
}
