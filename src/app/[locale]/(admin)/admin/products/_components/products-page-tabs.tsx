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

interface ProductsPageTabsProps {
  readonly products: readonly Product["select"][]
  readonly categories: readonly Category["select"][]
  readonly labels: {
    readonly all: string
    readonly categories: string
    readonly collections: string
    readonly courses: string
    readonly drafts: string
    readonly onetime: string
    readonly subscriptions: string
  }
}

export function ProductsPageTabs({ products, categories, labels }: ProductsPageTabsProps): JSX.Element {
  return (
    <Tabs defaultSelectedKey="all" className="w-full">
      <div className="flex flex-col gap-4 border-b border-border sm:flex-row sm:items-center sm:justify-between">
        <TabsList variant="line" className="no-scrollbar flex-1 justify-start gap-6 overflow-x-auto">
          <TabsTrigger id="all" className="flex-none px-0 text-sm">
            {labels.all}
          </TabsTrigger>
          <TabsTrigger id="onetime" className="flex-none px-0 text-sm">
            {labels.onetime}
          </TabsTrigger>
          <TabsTrigger id="subscriptions" className="flex-none px-0 text-sm">
            {labels.subscriptions}
          </TabsTrigger>
          <TabsTrigger id="categories" className="flex-none px-0 text-sm">
            {labels.categories}
          </TabsTrigger>
          <TabsTrigger id="collections" className="flex-none px-0 text-sm">
            {labels.collections}
          </TabsTrigger>
          <TabsTrigger id="drafts" className="flex-none px-0 text-sm">
            {labels.drafts}
          </TabsTrigger>
          <TabsTrigger id="courses" className="flex-none px-0 text-sm">
            {labels.courses}
          </TabsTrigger>
        </TabsList>
      </div>

      <ProductsAllTab products={products} />
      <ProductsOnetimeTab products={products} />
      <ProductsSubscriptionsTab products={products} />
      <ProductsCategoriesTab categories={categories} />
      <ProductsCollectionsTab categories={categories} />
      <ProductsCoursesTab />
    </Tabs>
  )
}
