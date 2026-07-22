import type { Category } from "~/src/modules/category/category.types"

import type { AdminCategoryRow } from "~/src/app/[locale]/(admin)/admin/_types"

const VISIBILITY_LABEL: Record<string, string> = {
  hidden: "Hidden",
  public: "Public",
}

export function mapCategoryRowToAdminRow(row: Category["select"]): AdminCategoryRow {
  return {
    description: row.description,
    icon: row.icon,
    id: row.id,
    items: "0",
    lastUpdated: row.updatedAt.toLocaleDateString("en-US", {
      day: "numeric",
      month: "short",
      year: "numeric",
    }),
    name: row.name,
    visibility: VISIBILITY_LABEL[row.visibility] ?? row.visibility,
    visibilityStatus: row.visibility,
  }
}
