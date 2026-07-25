import type { JSX } from "react"

import type { ProductType } from "~/src/modules/product/product.schema"
import type { Product } from "~/src/modules/product/product.types"

import { Badge } from "~/src/presentation/components/shadcn/badge"

import { AdminTableCheckbox } from "~/src/app/[locale]/(admin)/admin/products/_components/admin-table-checkbox"
import { ProductStatusBadge } from "~/src/app/[locale]/(admin)/admin/products/_components/product-status-badge"
import { ProductsRowActionsButton } from "~/src/app/[locale]/(admin)/admin/products/_components/products-row-actions-button"

const TYPE_LABEL: Record<ProductType, string> = {
  course: "Course",
  one_time: "One-time",
  subscription: "Subscription",
}

const METRICS_PLACEHOLDER = "—"

interface ProductsTableRowProps {
  readonly product: Product["select"]
}

function formatBillingCycleSuffix(billingCycle: string | null): string {
  if (billingCycle === null || billingCycle.length === 0) {
    return ""
  }

  return `/ ${billingCycle}`
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
          {TYPE_LABEL[product.type]}
        </Badge>
      </td>
      <td className="p-4">
        <div className="text-sm font-medium text-foreground">
          {product.priceCents} {product.currency}{" "}
          <span className="font-normal text-muted-foreground">{formatBillingCycleSuffix(product.billingCycle)}</span>
        </div>
      </td>
      <td className="p-4">
        <ProductStatusBadge status={product.status} />
      </td>
      <td className="p-4 text-sm text-muted-foreground">{METRICS_PLACEHOLDER}</td>
      <td className="p-4 text-right">
        <ProductsRowActionsButton />
      </td>
    </tr>
  )
}
