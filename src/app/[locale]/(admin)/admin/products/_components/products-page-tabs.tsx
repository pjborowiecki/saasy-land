/* eslint-disable react-perf/jsx-no-new-array-as-prop -- tab panels receive derived catalog lists */
import type { JSX } from "react"

import type { ProductDto } from "~/src/modules/catalog/application/dto/product.dto"

import { Tabs, TabsList, TabsTrigger } from "~/src/presentation/components/shadcn/tabs"

import type { AdminCategoryRow } from "~/src/app/[locale]/(admin)/admin/_types"
import { ProductsAllTab } from "~/src/app/[locale]/(admin)/admin/products/_components/products-all-tab"
import { ProductsCategoriesTab } from "~/src/app/[locale]/(admin)/admin/products/_components/products-categories-tab"
import { ProductsCollectionsTab } from "~/src/app/[locale]/(admin)/admin/products/_components/products-collections-tab"
import { ProductsCoursesTab } from "~/src/app/[locale]/(admin)/admin/products/_components/products-courses-tab"
import { ProductsOnetimeTab } from "~/src/app/[locale]/(admin)/admin/products/_components/products-onetime-tab"
import { ProductsSubscriptionsTab } from "~/src/app/[locale]/(admin)/admin/products/_components/products-subscriptions-tab"
import { mapProductDtoToAdminRow } from "~/src/app/[locale]/(admin)/admin/products/_lib/map-product-dto-to-admin-row"

interface ProductsPageTabsProps {
  readonly catalogDtos: readonly ProductDto[]
  readonly categories: readonly AdminCategoryRow[]
  readonly collections: readonly AdminCategoryRow[]
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

export function ProductsPageTabs({ catalogDtos, categories, collections, labels }: ProductsPageTabsProps): JSX.Element {
  const products = catalogDtos.map((dto) => mapProductDtoToAdminRow(dto))
  const oneTimeProducts = products.filter((product) => product.type === "One-time")
  const subscriptionProducts = products.filter((product) => product.type === "Subscription")

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
      <ProductsOnetimeTab products={oneTimeProducts} />
      <ProductsSubscriptionsTab products={subscriptionProducts} />
      <ProductsCategoriesTab categories={categories} />
      <ProductsCollectionsTab collections={collections} />
      <ProductsCoursesTab />
    </Tabs>
  )
}
