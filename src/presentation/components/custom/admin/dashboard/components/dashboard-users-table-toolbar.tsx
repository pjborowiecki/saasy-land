import type { JSX } from "react"

import { ArrowDownUp, Download, Filter, Search } from "lucide-react"
import { useTranslations } from "use-intl/react"

import { Button } from "~/src/presentation/components/shadcn/button"
import { Input } from "~/src/presentation/components/shadcn/input"

export const DashboardUsersTableToolbar = (): JSX.Element => {
  const t = useTranslations("pages.admin.dashboard")

  return (
    <div className="flex flex-col justify-between gap-3 border-b border-border px-4 py-3 sm:flex-row sm:items-center">
      <div className="flex flex-wrap items-center gap-2">
        <div className="relative w-52">
          <Search aria-hidden className="absolute top-1/2 left-2.5 size-3.5 -translate-y-1/2 text-muted-foreground" strokeWidth={1.75} />
          <Input className="h-8 pl-8 text-[0.8125rem]" placeholder={t("users.search")} />
        </div>
        <Button className="h-8 gap-1.5 px-2.5 text-xs" size="sm" variant="outline">
          <Filter className="size-3.5 text-muted-foreground" strokeWidth={1.75} />
          {t("users.filters.role")}
        </Button>
        <Button className="h-8 gap-1.5 px-2.5 text-xs" size="sm" variant="outline">
          <ArrowDownUp className="size-3.5 text-muted-foreground" strokeWidth={1.75} />
          {t("users.filters.status")}
        </Button>
      </div>
      <Button className="h-8 gap-1.5 self-start px-2.5 text-xs sm:self-auto" size="sm" variant="outline">
        <Download className="size-3.5 text-muted-foreground" strokeWidth={1.75} />
        {t("users.export")}
      </Button>
    </div>
  )
}
