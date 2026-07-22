import "server-only"

import { cache } from "react"

import { listCategories } from "~/src/modules/category/use-cases/list-categories.use-case"

import { unwrapServerActionData } from "~/src/app/[locale]/(admin)/admin/_lib/server-action-result"
import type { AdminCategoryRow } from "~/src/app/[locale]/(admin)/admin/_types"
import { mapCategoryRowToAdminRow } from "~/src/app/[locale]/(admin)/admin/products/_lib/map-category-to-admin-row"

/** RSC read. `cache()` = per-request dedupe; no `use cache` (admin catalog stays fresh). */
export const getAdminCategoryCatalog = cache(
  async (): Promise<{
    readonly categories: AdminCategoryRow[]
    readonly collections: AdminCategoryRow[]
  }> => {
    const rows = unwrapServerActionData(await listCategories())

    const categories: AdminCategoryRow[] = []
    const collections: AdminCategoryRow[] = []

    for (const row of rows) {
      const adminRow = mapCategoryRowToAdminRow(row)

      if (row.kind === "collection") {
        collections.push(adminRow)
      } else {
        categories.push(adminRow)
      }
    }

    return { categories, collections }
  },
)
