import type { Product } from "~/src/modules/product/product.types"

import type { AdminProductRow } from "~/src/app/[locale]/(admin)/admin/_types"

const TYPE_LABEL: Record<string, string> = {
  course: "Course",
  one_time: "One-time",
  subscription: "Subscription",
}

const STATUS_LABEL: Record<string, string> = {
  archived: "Archived",
  draft: "Draft",
  published: "Active",
}

const STATUS_COLOR: Record<string, AdminProductRow["statusColor"]> = {
  archived: "rose",
  draft: "amber",
  published: "emerald",
}

export function mapProductRowToAdminRow(row: Product["select"]): AdminProductRow {
  const billingCycle = row.billingCycle === null || row.billingCycle.length === 0 ? "" : `/ ${row.billingCycle}`

  return {
    billingCycle,
    description: row.description,
    icon: row.type === "course" ? "Video" : "Layers",
    iconColor: "default",
    id: row.id,
    metrics: "—",
    name: row.name,
    price: `${row.priceCents} ${row.currency}`,
    status: STATUS_LABEL[row.status] ?? row.status,
    statusColor: STATUS_COLOR[row.status] ?? "amber",
    type: TYPE_LABEL[row.type] ?? row.type,
  }
}
