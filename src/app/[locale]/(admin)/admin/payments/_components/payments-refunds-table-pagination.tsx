import type { JSX } from "react"

import { getTranslations } from "next-intl/server"

import { Button } from "~/src/presentation/components/shadcn/button"

export async function PaymentsRefundsTablePagination(): Promise<JSX.Element> {
  const t = await getTranslations("pages.admin.payments")
  return (
    <div className="flex items-center justify-between border-t border-border px-5 py-3 text-xs text-muted-foreground">
      <span>{t("table.pagination.showing")}</span>
      <div className="flex items-center gap-1">
        <Button variant="outline" size="sm" className="h-8 px-2.5 text-xs" isDisabled>
          {t("table.pagination.previous")}
        </Button>
        <Button variant="secondary" size="icon" className="size-8 text-xs font-medium">
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
  )
}
