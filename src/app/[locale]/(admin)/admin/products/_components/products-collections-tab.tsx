import type { JSX } from "react"

import type { Category } from "~/src/modules/category/category.types"

import { TabsContent } from "~/src/presentation/components/shadcn/tabs"

import { ProductsCategoryRow } from "~/src/app/[locale]/(admin)/admin/products/_components/products-category-row"
import { ProductsTabToolbar } from "~/src/app/[locale]/(admin)/admin/products/_components/products-tab-toolbar"
import { ProductsTableCard } from "~/src/app/[locale]/(admin)/admin/products/_components/products-table-card"
import { ProductsTableHead } from "~/src/app/[locale]/(admin)/admin/products/_components/products-table-head"

interface ProductsCollectionsTabProps {
  readonly categories: readonly Category["select"][]
}

export function ProductsCollectionsTab({ categories }: ProductsCollectionsTabProps): JSX.Element {
  return (
    <TabsContent id="collections" className="mt-6 space-y-4 outline-none">
      <ProductsTabToolbar showTypeFilter={false} />

      <ProductsTableCard end={3} total={3}>
        <ProductsTableHead variant="collections" />
        <tbody className="divide-y divide-border/40">
          {categories
            .filter((category) => category.kind === "collection")
            .map((category) => (
              <ProductsCategoryRow key={category.id} category={category} />
            ))}
        </tbody>
      </ProductsTableCard>
    </TabsContent>
  )
}
