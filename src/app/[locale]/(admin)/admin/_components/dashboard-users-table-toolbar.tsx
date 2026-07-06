import type { JSX } from "react"

import { ArrowDownUp, Download, Filter, Search } from "lucide-react"
import { getTranslations } from "next-intl/server"

import { Button } from "~/src/components/shadcn/button"
import { Input } from "~/src/components/shadcn/input"

export async function DashboardUsersTableToolbar(): Promise<JSX.Element> {
  const t = await getTranslations("pages.admin.dashboard")
  return (
    <div className="flex flex-col justify-between gap-4 border-b border-border/40 bg-secondary/20 p-4 sm:flex-row sm:items-center">
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
  )
}
