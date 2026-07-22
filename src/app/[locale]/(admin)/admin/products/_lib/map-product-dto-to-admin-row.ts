import type { ProductDto } from "~/src/modules/catalog/application/dto/product.dto"

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

export function mapProductDtoToAdminRow(dto: ProductDto): AdminProductRow {
  const billingCycle = dto.billingCycle === undefined || dto.billingCycle.length === 0 ? "" : `/ ${dto.billingCycle}`

  return {
    billingCycle,
    description: dto.description,
    icon: dto.type === "course" ? "Video" : "Layers",
    iconColor: "default",
    id: dto.id,
    metrics: "—",
    name: dto.name,
    price: `${dto.priceCents} ${dto.currency}`,
    status: STATUS_LABEL[dto.status] ?? dto.status,
    statusColor: STATUS_COLOR[dto.status] ?? "amber",
    type: TYPE_LABEL[dto.type] ?? dto.type,
  }
}
