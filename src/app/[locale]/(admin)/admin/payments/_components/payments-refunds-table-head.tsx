import type { JSX } from "react"

import { getTranslations } from "next-intl/server"

import { TableHead, TableHeader, TableRow } from "~/src/components/shadcn/table"

export async function PaymentsRefundsTableHead(): Promise<JSX.Element> {
  const t = await getTranslations("pages.admin.payments")
  return (
    <TableHeader>
      <TableRow>
        <TableHead>{t("table.columns.customer")}</TableHead>
        <TableHead>{t("table.columns.amount")}</TableHead>
        <TableHead>{t("table.columns.item")}</TableHead>
        <TableHead>{t("table.columns.reason")}</TableHead>
        <TableHead>{t("table.columns.date")}</TableHead>
        <TableHead>{t("table.columns.status")}</TableHead>
        <TableHead className="w-[50px]" />
      </TableRow>
    </TableHeader>
  )
}
