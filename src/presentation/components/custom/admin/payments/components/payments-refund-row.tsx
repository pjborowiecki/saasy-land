import type { JSX } from "react"

import { MoreHorizontal } from "lucide-react"

import { Button } from "~/src/presentation/components/shadcn/button"
import { TableCell, TableRow } from "~/src/presentation/components/shadcn/table"

import type { AdminPaymentRow } from "~/src/presentation/components/custom/admin/types"

interface PaymentsRefundRowProps {
  readonly row: AdminPaymentRow
}

export const PaymentsRefundRow = ({ row }: PaymentsRefundRowProps): JSX.Element => (
  <TableRow className="group">
    <TableCell className="py-3.5">
      <PaymentsRefundCustomerCell row={row} />
    </TableCell>
    <TableCell className="py-3.5">
      <PaymentsRefundAmountCell row={row} />
    </TableCell>
    <TableCell className="py-3.5 text-sm">{row.item}</TableCell>
    <TableCell className="py-3.5 text-sm text-muted-foreground">{row.reason}</TableCell>
    <TableCell className="py-3.5 text-sm text-muted-foreground">{row.date}</TableCell>
    <TableCell className="py-3.5">
      <PaymentsRefundStatusCell row={row} />
    </TableCell>
    <TableCell className="py-3.5 text-right">
      <Button variant="ghost" size="icon" className="size-7 opacity-0 transition-opacity group-hover:opacity-100">
        <MoreHorizontal className="size-4 text-muted-foreground" />
      </Button>
    </TableCell>
  </TableRow>
)

const PaymentsRefundCustomerCell = ({ row }: PaymentsRefundRowProps): JSX.Element => (
  <div className="flex items-center gap-3">
    <div className="flex size-7 shrink-0 items-center justify-center rounded-full border border-border bg-secondary text-xs font-medium text-foreground">
      {row.initials}
    </div>
    <div className="flex flex-col">
      <span className="text-sm font-medium">{row.name}</span>
      <span className="text-xs text-muted-foreground">{row.email}</span>
    </div>
  </div>
)

const PaymentsRefundAmountCell = ({ row }: PaymentsRefundRowProps): JSX.Element => (
  <div className="flex flex-col">
    <span className="text-sm font-medium">{row.amount}</span>
    <span className="text-xs text-muted-foreground">{row.type}</span>
  </div>
)

const PaymentsRefundStatusCell = ({ row }: PaymentsRefundRowProps): JSX.Element => (
  <div className="flex items-center gap-2">
    <div className={`size-1.5 rounded-full ${row.statusColor}`} />
    <span className={`text-sm ${row.statusTextColor}`}>{row.status}</span>
  </div>
)
