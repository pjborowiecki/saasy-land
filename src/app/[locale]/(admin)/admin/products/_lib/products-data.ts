import "server-only"

import { cache } from "react"

import { listProducts } from "~/src/modules/product/use-cases/list-products.use-case"

import { unwrapServerActionData } from "~/src/app/[locale]/(admin)/admin/_lib/server-action-result"
import type { AdminProductRow } from "~/src/app/[locale]/(admin)/admin/_types"
import { mapProductRowToAdminRow } from "~/src/app/[locale]/(admin)/admin/products/_lib/map-product-to-admin-row"

/** RSC read. `cache()` = per-request dedupe; no `use cache` (admin catalog stays fresh). */
export const getAdminProducts = cache(async (): Promise<AdminProductRow[]> => {
  const result = await listProducts()

  return unwrapServerActionData(result).map((row) => mapProductRowToAdminRow(row))
})
