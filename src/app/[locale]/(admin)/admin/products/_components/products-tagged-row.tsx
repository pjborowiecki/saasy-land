import type { JSX } from "react"

import { Badge } from "~/src/presentation/components/shadcn/badge"

import { AdminTableCheckbox } from "~/src/app/[locale]/(admin)/admin/_components/admin-table-checkbox"
import { ProductStatusBadge } from "~/src/app/[locale]/(admin)/admin/_components/product-status-badge"
import { NON_EMPTY_COLLECTION_LENGTH } from "~/src/app/[locale]/(admin)/admin/_lib/constants"
import { getTagBadgeClass } from "~/src/app/[locale]/(admin)/admin/_lib/status-colors"
import type { AdminProductRow } from "~/src/app/[locale]/(admin)/admin/_types"
import { ProductsRowActionsButton } from "~/src/app/[locale]/(admin)/admin/products/_components/products-row-actions-button"

interface ProductsTaggedRowProps {
  readonly product: AdminProductRow
}

export function ProductsTaggedRow({ product }: ProductsTaggedRowProps): JSX.Element {
  return (
    <tr className="group transition-colors hover:bg-secondary/20">
      <td className="p-4 pt-5 align-top">
        <AdminTableCheckbox />
      </td>
      <td className="p-4 align-top">
        <div className="text-sm font-medium text-foreground">{product.name}</div>
        <div className="mt-0.5 text-xs text-muted-foreground">{product.description}</div>
        {product.tags !== undefined && product.tags.length >= NON_EMPTY_COLLECTION_LENGTH ? (
          <div className="mt-2.5 flex flex-wrap items-center gap-1.5">
            {product.tags.map((tag) => (
              <span
                key={tag.text}
                className={`inline-flex items-center rounded-md border px-1.5 py-0.5 text-[10px] font-medium ${getTagBadgeClass(tag.color)}`}
              >
                {tag.text}
              </span>
            ))}
          </div>
        ) : undefined}
      </td>
      <td className="p-4 pt-5 align-top">
        <Badge variant="outline" className="px-2 py-1 text-xs font-medium text-muted-foreground">
          {product.type}
        </Badge>
      </td>
      <td className="p-4 pt-5 align-top">
        <div className="text-sm font-medium text-foreground">
          {product.price} <span className="font-normal text-muted-foreground">{product.billingCycle}</span>
        </div>
      </td>
      <td className="p-4 pt-5 align-top">
        <ProductStatusBadge status={product.status} statusColor={product.statusColor} />
      </td>
      <td className="p-4 pt-5 align-top text-sm text-muted-foreground">{product.metrics}</td>
      <td className="p-4 pt-4 text-right align-top">
        <ProductsRowActionsButton />
      </td>
    </tr>
  )
}
