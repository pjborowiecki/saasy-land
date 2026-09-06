import type { JSX } from "react"

import type { Category } from "~/src/modules/category/category.types"

import { TabsContent } from "~/src/presentation/components/shadcn/tabs"

import { ProductsCategoryRow } from "~/src/presentation/components/custom/admin/products/components/products-category-row"
import { ProductsTabToolbar } from "~/src/presentation/components/custom/admin/products/components/products-tab-toolbar"
import { ProductsTableCard } from "~/src/presentation/components/custom/admin/products/components/products-table-card"
import { ProductsTableHead } from "~/src/presentation/components/custom/admin/products/components/products-table-head"

interface ProductsCollectionsTabProps {
  readonly categories: readonly Category["select"][]
}

export const ProductsCollectionsTab = ({ categories }: ProductsCollectionsTabProps): JSX.Element => (
  <TabsContent id="collections" className="mt-6 space-y-4 outline-none">
    <ProductsTabToolbar showTypeFilter={false} />

    <ProductsTableCard end={3} total={3}>
      <ProductsTableHead variant="collections" />
      <tbody className="divide-y divide-border">
        {categories
          .filter((category) => category.kind === "collection")
          .map((category) => (
            <ProductsCategoryRow key={category.id} category={category} />
          ))}
      </tbody>
    </ProductsTableCard>
  </TabsContent>
)
