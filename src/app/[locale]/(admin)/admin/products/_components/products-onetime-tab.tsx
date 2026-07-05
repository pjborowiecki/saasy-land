import type { JSX } from "react"

import type { AdminProductRow } from "~/src/lib/admin/demo-data.types"

import { TabsContent } from "~/src/components/shadcn/tabs"

import { ProductsTabToolbar } from "~/src/app/[locale]/(admin)/admin/products/_components/products-tab-toolbar"
import { ProductsTableCard } from "~/src/app/[locale]/(admin)/admin/products/_components/products-table-card"
import { ProductsTableHead } from "~/src/app/[locale]/(admin)/admin/products/_components/products-table-head"
import { ProductsTaggedRow } from "~/src/app/[locale]/(admin)/admin/products/_components/products-tagged-row"

interface ProductsOnetimeTabProps {
  readonly products: readonly AdminProductRow[]
}

export function ProductsOnetimeTab({ products }: ProductsOnetimeTabProps): JSX.Element {
  return (
    <TabsContent value="onetime" className="mt-6 space-y-4 outline-none">
      <ProductsTabToolbar />

      <ProductsTableCard end={3} total={3}>
        <ProductsTableHead variant="all" />
        <tbody className="divide-y divide-border/40">
          {products.map((product) => (
            <ProductsTaggedRow key={product.id} product={product} />
          ))}
        </tbody>
      </ProductsTableCard>
    </TabsContent>
  )
}
