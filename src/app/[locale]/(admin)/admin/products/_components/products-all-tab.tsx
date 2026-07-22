import type { JSX } from "react"

import { TabsContent } from "~/src/presentation/components/shadcn/tabs"

import type { AdminProductRow } from "~/src/app/[locale]/(admin)/admin/_types"
import { ProductsTabToolbar } from "~/src/app/[locale]/(admin)/admin/products/_components/products-tab-toolbar"
import { ProductsTableCard } from "~/src/app/[locale]/(admin)/admin/products/_components/products-table-card"
import { ProductsTableHead } from "~/src/app/[locale]/(admin)/admin/products/_components/products-table-head"
import { ProductsTableRow } from "~/src/app/[locale]/(admin)/admin/products/_components/products-table-row"

interface ProductsAllTabProps {
  readonly products: readonly AdminProductRow[]
}

export function ProductsAllTab({ products }: ProductsAllTabProps): JSX.Element {
  return (
    <TabsContent id="all" className="mt-6 space-y-4 outline-none">
      <ProductsTabToolbar />

      <ProductsTableCard end={4} total={4}>
        <ProductsTableHead variant="all" />
        <tbody className="divide-y divide-border/40">
          {products.map((product) => (
            <ProductsTableRow key={product.id} product={product} />
          ))}
        </tbody>
      </ProductsTableCard>
    </TabsContent>
  )
}
