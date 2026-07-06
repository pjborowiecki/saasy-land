import type { JSX } from "react"

import { getTranslations } from "next-intl/server"

import { AdminTableCheckbox } from "~/src/app/[locale]/(admin)/admin/_components/admin-table-checkbox"

type ProductsTableHeadVariant = "all" | "subscriptions" | "categories" | "collections"

interface ProductsTableHeadProps {
  readonly variant: ProductsTableHeadVariant
}

function TableHeaderCell({ children }: { readonly children: string }): JSX.Element {
  return <th className="p-4 text-xs font-medium tracking-wider text-muted-foreground uppercase">{children}</th>
}

function getTableHeaders(variant: ProductsTableHeadVariant, t: Awaited<ReturnType<typeof getTranslations>>): readonly string[] {
  if (variant === "subscriptions") {
    return [
      t("subscriptions.table.headers.product"),
      t("subscriptions.table.headers.model"),
      t("subscriptions.table.headers.pricing"),
      t("subscriptions.table.headers.status"),
      t("subscriptions.table.headers.metrics"),
    ]
  }

  if (variant === "categories") {
    return [
      t("categories.table.headers.category"),
      t("categories.table.headers.visibility"),
      t("categories.table.headers.items"),
      t("categories.table.headers.lastUpdated"),
    ]
  }

  if (variant === "collections") {
    return [
      t("collections.table.headers.collection"),
      t("collections.table.headers.visibility"),
      t("collections.table.headers.items"),
      t("collections.table.headers.lastUpdated"),
    ]
  }

  return [
    t("table.headers.product"),
    t("table.headers.type"),
    t("table.headers.pricing"),
    t("table.headers.status"),
    t("table.headers.metrics"),
  ]
}

export async function ProductsTableHead({ variant }: ProductsTableHeadProps): Promise<JSX.Element> {
  const t = await getTranslations("pages.admin.products")
  const headers = getTableHeaders(variant, t)

  return (
    <thead>
      <tr className="border-b border-border/40 bg-secondary/20">
        <th className="w-12 p-4 text-center">
          <AdminTableCheckbox selectAll />
        </th>
        {headers.map((label) => (
          <TableHeaderCell key={label}>{label}</TableHeaderCell>
        ))}
        <th className="w-12 p-4" aria-label="Actions" />
      </tr>
    </thead>
  )
}
