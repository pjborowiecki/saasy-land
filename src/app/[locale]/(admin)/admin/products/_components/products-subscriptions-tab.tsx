import type { JSX } from "react"

import { TabsContent } from "~/src/presentation/components/shadcn/tabs"

import type { AdminProductRow } from "~/src/app/[locale]/(admin)/admin/_types"
import { ProductsTabToolbar } from "~/src/app/[locale]/(admin)/admin/products/_components/products-tab-toolbar"
import { ProductsTableCard } from "~/src/app/[locale]/(admin)/admin/products/_components/products-table-card"
import { ProductsTableHead } from "~/src/app/[locale]/(admin)/admin/products/_components/products-table-head"
import { ProductsTaggedRow } from "~/src/app/[locale]/(admin)/admin/products/_components/products-tagged-row"

interface ProductsSubscriptionsTabProps {
  readonly products: readonly AdminProductRow[]
}

export function ProductsSubscriptionsTab({ products }: ProductsSubscriptionsTabProps): JSX.Element {
  return (
    <TabsContent id="subscriptions" className="mt-6 space-y-4 outline-none">
      <ProductsTabToolbar />

      <ProductsTableCard end={3} total={3}>
        <ProductsTableHead variant="subscriptions" />
        <tbody className="divide-y divide-border/40">
          {products.map((product) => (
            <ProductsTaggedRow key={product.id} product={product} />
          ))}
        </tbody>
      </ProductsTableCard>
    </TabsContent>
  )
}
