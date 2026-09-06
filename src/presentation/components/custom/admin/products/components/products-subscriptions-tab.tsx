import type { JSX } from "react"

import type { Product } from "~/src/modules/product/product.types"

import { TabsContent } from "~/src/presentation/components/shadcn/tabs"

import { ProductsTabToolbar } from "~/src/presentation/components/custom/admin/products/components/products-tab-toolbar"
import { ProductsTableCard } from "~/src/presentation/components/custom/admin/products/components/products-table-card"
import { ProductsTableHead } from "~/src/presentation/components/custom/admin/products/components/products-table-head"
import { ProductsTaggedRow } from "~/src/presentation/components/custom/admin/products/components/products-tagged-row"

interface ProductsSubscriptionsTabProps {
  readonly products: readonly Product["select"][]
}

export const ProductsSubscriptionsTab = ({ products }: ProductsSubscriptionsTabProps): JSX.Element => (
  <TabsContent id="subscriptions" className="mt-6 space-y-4 outline-none">
    <ProductsTabToolbar />

    <ProductsTableCard end={3} total={3}>
      <ProductsTableHead variant="subscriptions" />
      <tbody className="divide-y divide-border">
        {products
          .filter((product) => product.type === "subscription")
          .map((product) => (
            <ProductsTaggedRow key={product.id} product={product} />
          ))}
      </tbody>
    </ProductsTableCard>
  </TabsContent>
)
