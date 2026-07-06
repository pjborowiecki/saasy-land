import type { JSX } from "react"

import { Badge } from "~/src/components/shadcn/badge"

import { AdminTableCheckbox } from "~/src/app/[locale]/(admin)/admin/_components/admin-table-checkbox"
import { ProductStatusBadge } from "~/src/app/[locale]/(admin)/admin/_components/product-status-badge"
import type { AdminProductRow } from "~/src/app/[locale]/(admin)/admin/_types"
import { ProductsRowActionsButton } from "~/src/app/[locale]/(admin)/admin/products/_components/products-row-actions-button"

interface ProductsTableRowProps {
  readonly product: AdminProductRow
}

export function ProductsTableRow({ product }: ProductsTableRowProps): JSX.Element {
  return (
    <tr className="group transition-colors hover:bg-secondary/20">
      <td className="p-4 text-center">
        <AdminTableCheckbox />
      </td>
      <td className="p-4">
        <div className="text-sm font-medium text-foreground">{product.name}</div>
        <div className="mt-0.5 text-xs text-muted-foreground">{product.description}</div>
      </td>
      <td className="p-4">
        <Badge variant="outline" className="px-2 py-1 text-xs font-medium text-muted-foreground">
          {product.type}
        </Badge>
      </td>
      <td className="p-4">
        <div className="text-sm font-medium text-foreground">
          {product.price} <span className="font-normal text-muted-foreground">{product.billingCycle}</span>
        </div>
      </td>
      <td className="p-4">
        <ProductStatusBadge status={product.status} statusColor={product.statusColor} />
      </td>
      <td className="p-4 text-sm text-muted-foreground">{product.metrics}</td>
      <td className="p-4 text-right">
        <ProductsRowActionsButton />
      </td>
    </tr>
  )
}
