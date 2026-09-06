import { useFormatter, useTranslations } from "use-intl/react"

import { ADMIN_PAYMENT_ROWS } from "~/src/data/admin"

import type { AdminPaymentRow } from "~/src/presentation/components/custom/admin/types"
export const useDemoPayments = (): AdminPaymentRow[] => {
  const t = useTranslations("pages.admin.payments.demo")
  const format = useFormatter()
  return ADMIN_PAYMENT_ROWS.map((row) => ({
    amount: format.number(row.amount, { currency: "USD", style: "currency" }),
    date: format.dateTime(new Date(row.date), { day: "numeric", month: "short", year: "numeric" }),
    email: row.email,
    id: row.id,
    initials: row.initials,
    item: t(`p${row.id}.item`),
    name: row.name,
    reason: t(`p${row.id}.reason`),
    status: t(`p${row.id}.status`),
    statusColor: row.statusColor,
    statusTextColor: row.statusTextColor,
    type: t(`p${row.id}.type`),
  }))
}
