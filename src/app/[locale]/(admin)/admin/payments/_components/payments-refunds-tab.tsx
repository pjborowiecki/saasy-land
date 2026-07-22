import type { JSX } from "react"

import { Clock, CreditCard, Filter, TrendingDown } from "lucide-react"
import { getTranslations } from "next-intl/server"

import { Button } from "~/src/presentation/components/shadcn/button"
import { Card } from "~/src/presentation/components/shadcn/card"
import { Table, TableBody } from "~/src/presentation/components/shadcn/table"

import type { AdminPaymentRow } from "~/src/app/[locale]/(admin)/admin/_types"
import { PaymentsRefundRow } from "~/src/app/[locale]/(admin)/admin/payments/_components/payments-refund-row"
import { PaymentsRefundStatCard } from "~/src/app/[locale]/(admin)/admin/payments/_components/payments-refund-stat-card"
import { PaymentsRefundsTableHead } from "~/src/app/[locale]/(admin)/admin/payments/_components/payments-refunds-table-head"
import { PaymentsRefundsTablePagination } from "~/src/app/[locale]/(admin)/admin/payments/_components/payments-refunds-table-pagination"

interface PaymentsRefundsTabProps {
  readonly paymentRows: readonly AdminPaymentRow[]
}

export async function PaymentsRefundsTab({ paymentRows }: PaymentsRefundsTabProps): Promise<JSX.Element> {
  const t = await getTranslations("pages.admin.payments")
  return (
    <div className="mt-6 space-y-6">
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3 sm:gap-6">
        <PaymentsRefundStatCard icon={CreditCard} statKey="refunded" trendIcon={TrendingDown} />
        <PaymentsRefundStatCard icon={TrendingDown} statKey="refundRate" trendIcon={TrendingDown} />
        <PaymentsRefundStatCard icon={Clock} statKey="pending" />
      </div>

      <Card className="overflow-hidden">
        <div className="flex items-center justify-between border-b border-border/40 px-5 py-4">
          <h2 className="text-base font-medium text-foreground">{t("table.title")}</h2>
          <Button variant="ghost" size="icon" className="size-8 text-muted-foreground">
            <Filter className="size-4" />
          </Button>
        </div>
        <div className="custom-scrollbar w-full overflow-x-auto">
          <Table>
            <PaymentsRefundsTableHead />
            <TableBody>
              {paymentRows.map((row) => (
                <PaymentsRefundRow key={row.id} row={row} />
              ))}
            </TableBody>
          </Table>
        </div>
        <PaymentsRefundsTablePagination />
      </Card>
    </div>
  )
}
