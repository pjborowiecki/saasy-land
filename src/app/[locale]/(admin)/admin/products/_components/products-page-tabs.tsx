import type { JSX } from "react"

import type { Category } from "~/src/modules/category/category.types"
import type { Product } from "~/src/modules/product/product.types"

import { Tabs, TabsList, TabsTrigger } from "~/src/presentation/components/shadcn/tabs"

import { ProductsAllTab } from "~/src/app/[locale]/(admin)/admin/products/_components/products-all-tab"
import { ProductsCategoriesTab } from "~/src/app/[locale]/(admin)/admin/products/_components/products-categories-tab"
import { ProductsCollectionsTab } from "~/src/app/[locale]/(admin)/admin/products/_components/products-collections-tab"
import { ProductsCoursesTab } from "~/src/app/[locale]/(admin)/admin/products/_components/products-courses-tab"
import { ProductsOnetimeTab } from "~/src/app/[locale]/(admin)/admin/products/_components/products-onetime-tab"
import { ProductsSubscriptionsTab } from "~/src/app/[locale]/(admin)/admin/products/_components/products-subscriptions-tab"
import { PRODUCT_TABS, type ProductTab } from "~/src/app/[locale]/(admin)/admin/products/_lib/product-tabs"
import { ROUTES } from "~/src/routes"

interface ProductsPageTabsProps {
  readonly activeTab: ProductTab
  readonly products: readonly Product["select"][]
  readonly categories: readonly Category["select"][]
  readonly labels: Readonly<Record<ProductTab, string>>
}

function ActivePanel({ activeTab, categories, products }: Omit<ProductsPageTabsProps, "labels">): JSX.Element | undefined {
  switch (activeTab) {
    case "all":
    case "drafts": {
      return <ProductsAllTab products={products} />
    }
    case "onetime": {
      return <ProductsOnetimeTab products={products} />
    }
    case "subscriptions": {
      return <ProductsSubscriptionsTab products={products} />
    }
    case "categories": {
      return <ProductsCategoriesTab categories={categories} />
    }
    case "collections": {
      return <ProductsCollectionsTab categories={categories} />
    }
    case "courses": {
      return <ProductsCoursesTab />
    }
    default: {
      return undefined
    }
  }
}

export function ProductsPageTabs({ activeTab, products, categories, labels }: ProductsPageTabsProps): JSX.Element {
  return (
    <Tabs selectedKey={activeTab === "drafts" ? "all" : activeTab} className="w-full">
      <div className="flex flex-col gap-4 border-b border-border sm:flex-row sm:items-center sm:justify-between">
        <TabsList variant="line" className="no-scrollbar flex-1 justify-start gap-6 overflow-x-auto">
          {PRODUCT_TABS.map((tab) => (
            <TabsTrigger key={tab} id={tab} href={`${ROUTES.ADMIN_PRODUCTS}?tab=${tab}`} className="flex-none px-0 text-sm">
              {labels[tab]}
            </TabsTrigger>
          ))}
        </TabsList>
      </div>

      <ActivePanel activeTab={activeTab} categories={categories} products={products} />
    </Tabs>
  )
}
