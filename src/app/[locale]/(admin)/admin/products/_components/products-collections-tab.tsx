import type { JSX } from "react"

import { TabsContent } from "~/src/presentation/components/shadcn/tabs"

import type { AdminCategoryRow } from "~/src/app/[locale]/(admin)/admin/_types"
import { ProductsCategoryRow } from "~/src/app/[locale]/(admin)/admin/products/_components/products-category-row"
import { ProductsTabToolbar } from "~/src/app/[locale]/(admin)/admin/products/_components/products-tab-toolbar"
import { ProductsTableCard } from "~/src/app/[locale]/(admin)/admin/products/_components/products-table-card"
import { ProductsTableHead } from "~/src/app/[locale]/(admin)/admin/products/_components/products-table-head"

interface ProductsCollectionsTabProps {
  readonly collections: readonly AdminCategoryRow[]
}

export function ProductsCollectionsTab({ collections }: ProductsCollectionsTabProps): JSX.Element {
  return (
    <TabsContent id="collections" className="mt-6 space-y-4 outline-none">
      <ProductsTabToolbar showTypeFilter={false} />

      <ProductsTableCard end={3} total={3}>
        <ProductsTableHead variant="collections" />
        <tbody className="divide-y divide-border/40">
          {collections.map((collection) => (
            <ProductsCategoryRow key={collection.id} category={collection} />
          ))}
        </tbody>
      </ProductsTableCard>
    </TabsContent>
  )
}
