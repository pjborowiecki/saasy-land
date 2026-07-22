import type { JSX } from "react"

import { Badge } from "~/src/presentation/components/shadcn/badge"

import { getStatusBadgeClass, getStatusDotClass, type AdminStatusColor } from "~/src/app/[locale]/(admin)/admin/_lib/status-colors"

interface ProductStatusBadgeProps {
  readonly status: string
  readonly statusColor: AdminStatusColor
}

export function ProductStatusBadge({ status, statusColor }: ProductStatusBadgeProps): JSX.Element {
  return (
    <Badge variant="outline" className={`px-2 py-1 text-xs font-medium ${getStatusBadgeClass(statusColor)}`}>
      <span className={`mr-1.5 size-1.5 rounded-full ${getStatusDotClass(statusColor)}`} />
      {status}
    </Badge>
  )
}
