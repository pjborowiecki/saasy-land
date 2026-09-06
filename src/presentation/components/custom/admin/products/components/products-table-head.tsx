import type { JSX } from "react"

import { useTranslations } from "use-intl/react"

import { AdminTableCheckbox } from "~/src/presentation/components/custom/admin/products/components/admin-table-checkbox"

type ProductsTableHeadVariant = "all" | "subscriptions" | "categories" | "collections"

interface ProductsTableHeadProps {
  readonly variant: ProductsTableHeadVariant
}

const TableHeaderCell = ({ children }: { readonly children: string }): JSX.Element => (
  <th className="h-9 px-3 text-left align-middle text-[0.6875rem] font-medium tracking-[0.04em] whitespace-nowrap text-muted-foreground uppercase">
    {children}
  </th>
)

const getTableHeaders = (variant: ProductsTableHeadVariant, t: Awaited<ReturnType<typeof useTranslations>>): readonly string[] => {
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

export const ProductsTableHead = ({ variant }: ProductsTableHeadProps): JSX.Element => {
  const tCommon = useTranslations("pages.admin")

  const t = useTranslations("pages.admin.products")
  const headers = getTableHeaders(variant, t)

  return (
    <thead>
      <tr className="border-b border-border bg-muted/40">
        <th className="w-12 p-4 text-center">
          <AdminTableCheckbox selectAll />
        </th>
        {headers.map((label) => (
          <TableHeaderCell key={label}>{label}</TableHeaderCell>
        ))}
        <th className="w-12 p-4" aria-label={tCommon("labels.actions")} />
      </tr>
    </thead>
  )
}
