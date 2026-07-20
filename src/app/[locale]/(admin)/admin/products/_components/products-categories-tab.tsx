import type { JSX } from "react"

import { TabsContent } from "~/src/components/shadcn/tabs"

import type { AdminCategoryRow } from "~/src/app/[locale]/(admin)/admin/_types"
import { ProductsCategoryRow } from "~/src/app/[locale]/(admin)/admin/products/_components/products-category-row"
import { ProductsTabToolbar } from "~/src/app/[locale]/(admin)/admin/products/_components/products-tab-toolbar"
import { ProductsTableCard } from "~/src/app/[locale]/(admin)/admin/products/_components/products-table-card"
import { ProductsTableHead } from "~/src/app/[locale]/(admin)/admin/products/_components/products-table-head"

interface ProductsCategoriesTabProps {
  readonly categories: readonly AdminCategoryRow[]
}

export function ProductsCategoriesTab({ categories }: ProductsCategoriesTabProps): JSX.Element {
  return (
    <TabsContent id="categories" className="mt-6 space-y-4 outline-none">
      <ProductsTabToolbar showTypeFilter={false} />

      <ProductsTableCard end={3} total={3}>
        <ProductsTableHead variant="categories" />
        <tbody className="divide-y divide-border/40">
          {categories.map((category) => (
            <ProductsCategoryRow key={category.id} category={category} />
          ))}
        </tbody>
      </ProductsTableCard>
    </TabsContent>
  )
}
