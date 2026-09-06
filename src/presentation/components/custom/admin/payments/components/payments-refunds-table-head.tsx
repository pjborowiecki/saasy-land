import type { JSX } from "react"

import { useTranslations } from "use-intl/react"

import { TableHead, TableHeader, TableRow } from "~/src/presentation/components/shadcn/table"

export const PaymentsRefundsTableHead = (): JSX.Element => {
  const t = useTranslations("pages.admin.payments")
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
