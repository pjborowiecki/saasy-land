import type { JSX } from "react"

import type { ProductStatus } from "~/src/modules/product/product.schema"

import { Badge } from "~/src/presentation/components/shadcn/badge"

import {
  type AdminStatusColor,
  getStatusBadgeClass,
  getStatusDotClass,
} from "~/src/presentation/components/custom/admin/constants/status-colors"

const STATUS_LABEL: Record<ProductStatus, string> = {
  archived: "Archived",
  draft: "Draft",
  published: "Active",
}

const STATUS_COLOR: Record<ProductStatus, AdminStatusColor> = {
  archived: "rose",
  draft: "amber",
  published: "emerald",
}

interface ProductStatusBadgeProps {
  readonly status: ProductStatus
}

export const ProductStatusBadge = ({ status }: ProductStatusBadgeProps): JSX.Element => {
  const statusColor = STATUS_COLOR[status]
  const label = STATUS_LABEL[status]

  return (
    <Badge variant="outline" className={`px-2 py-1 text-xs font-medium ${getStatusBadgeClass(statusColor)}`}>
      <span className={`mr-1.5 size-1.5 rounded-full ${getStatusDotClass(statusColor)}`} />
      {label}
    </Badge>
  )
}
