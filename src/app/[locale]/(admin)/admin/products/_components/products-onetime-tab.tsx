import type { JSX } from "react"

import type { Product } from "~/src/modules/product/product.types"

import { TabsContent } from "~/src/presentation/components/shadcn/tabs"

import { ProductsTabToolbar } from "~/src/app/[locale]/(admin)/admin/products/_components/products-tab-toolbar"
import { ProductsTableCard } from "~/src/app/[locale]/(admin)/admin/products/_components/products-table-card"
import { ProductsTableHead } from "~/src/app/[locale]/(admin)/admin/products/_components/products-table-head"
import { ProductsTaggedRow } from "~/src/app/[locale]/(admin)/admin/products/_components/products-tagged-row"

interface ProductsOnetimeTabProps {
  readonly products: readonly Product["select"][]
}

export function ProductsOnetimeTab({ products }: ProductsOnetimeTabProps): JSX.Element {
  return (
    <TabsContent id="onetime" className="mt-6 space-y-4 outline-none">
      <ProductsTabToolbar />

      <ProductsTableCard end={3} total={3}>
        <ProductsTableHead variant="all" />
        <tbody className="divide-y divide-border">
          {products
            .filter((product) => product.type === "one_time")
            .map((product) => (
              <ProductsTaggedRow key={product.id} product={product} />
            ))}
        </tbody>
      </ProductsTableCard>
    </TabsContent>
  )
}
