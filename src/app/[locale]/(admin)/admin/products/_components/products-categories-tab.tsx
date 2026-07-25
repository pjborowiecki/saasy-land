import type { JSX } from "react"

import type { Category } from "~/src/modules/category/category.types"

import { TabsContent } from "~/src/presentation/components/shadcn/tabs"

import { ProductsCategoryRow } from "~/src/app/[locale]/(admin)/admin/products/_components/products-category-row"
import { ProductsTabToolbar } from "~/src/app/[locale]/(admin)/admin/products/_components/products-tab-toolbar"
import { ProductsTableCard } from "~/src/app/[locale]/(admin)/admin/products/_components/products-table-card"
import { ProductsTableHead } from "~/src/app/[locale]/(admin)/admin/products/_components/products-table-head"

interface ProductsCategoriesTabProps {
  readonly categories: readonly Category["select"][]
}

export function ProductsCategoriesTab({ categories }: ProductsCategoriesTabProps): JSX.Element {
  return (
    <TabsContent id="categories" className="mt-6 space-y-4 outline-none">
      <ProductsTabToolbar showTypeFilter={false} />

      <ProductsTableCard end={3} total={3}>
        <ProductsTableHead variant="categories" />
        <tbody className="divide-y divide-border/40">
          {categories
            .filter((category) => category.kind === "category")
            .map((category) => (
              <ProductsCategoryRow key={category.id} category={category} />
            ))}
        </tbody>
      </ProductsTableCard>
    </TabsContent>
  )
}
