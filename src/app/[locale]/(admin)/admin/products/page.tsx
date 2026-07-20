import type { Metadata } from "next"
import type { JSX } from "react"

import { getTranslations } from "next-intl/server"

import { Tabs, TabsList, TabsTrigger } from "~/src/components/shadcn/tabs"

import { ProductsAllTab } from "~/src/app/[locale]/(admin)/admin/products/_components/products-all-tab"
import { ProductsCategoriesTab } from "~/src/app/[locale]/(admin)/admin/products/_components/products-categories-tab"
import { ProductsCollectionsTab } from "~/src/app/[locale]/(admin)/admin/products/_components/products-collections-tab"
import { ProductsCoursesTab } from "~/src/app/[locale]/(admin)/admin/products/_components/products-courses-tab"
import { ProductsOnetimeTab } from "~/src/app/[locale]/(admin)/admin/products/_components/products-onetime-tab"
import { ProductsSubscriptionsTab } from "~/src/app/[locale]/(admin)/admin/products/_components/products-subscriptions-tab"
import {
  ADMIN_CATEGORY_ROWS,
  ADMIN_COLLECTION_ROWS,
  ADMIN_ONETIME_PRODUCT_ROWS,
  ADMIN_PRODUCT_ROWS,
  ADMIN_SUBSCRIPTION_ROWS,
} from "~/src/data/admin/mock-data"

export async function generateMetadata({ params }: Readonly<PageProps<"/[locale]/admin">>): Promise<Metadata> {
  const { locale } = await params
  const t = await getTranslations({ locale, namespace: "pages.admin.products" })

  return {
    description: t("metadata.description"),
    title: t("metadata.title"),
  }
}

export default async function ProductsPage({ params }: Readonly<PageProps<"/[locale]/admin">>): Promise<JSX.Element> {
  const { locale } = await params
  const t = await getTranslations({ locale, namespace: "pages.admin.products" })
  const products = ADMIN_PRODUCT_ROWS
  const oneTimeProducts = ADMIN_ONETIME_PRODUCT_ROWS
  const subscriptionProducts = ADMIN_SUBSCRIPTION_ROWS
  const categories = ADMIN_CATEGORY_ROWS
  const collections = ADMIN_COLLECTION_ROWS

  return (
    <div className="flex w-full animate-in flex-col space-y-8 duration-500 fade-in-50">
      <div className="flex flex-col gap-4">
        <div>
          <h1 className="mb-1 text-2xl font-medium tracking-tight text-foreground">{t("title")}</h1>
          <p className="text-sm text-muted-foreground">{t("description")}</p>
        </div>
      </div>

      <Tabs defaultSelectedKey="all" className="w-full">
        <div className="flex flex-col gap-4 border-b border-border sm:flex-row sm:items-center sm:justify-between">
          <TabsList variant="line" className="no-scrollbar flex-1 justify-start gap-6 overflow-x-auto">
            <TabsTrigger id="all" className="flex-none px-0 text-sm">
              {t("tabs.all")}
            </TabsTrigger>
            <TabsTrigger id="onetime" className="flex-none px-0 text-sm">
              {t("tabs.onetime")}
            </TabsTrigger>
            <TabsTrigger id="subscriptions" className="flex-none px-0 text-sm">
              {t("tabs.subscriptions")}
            </TabsTrigger>
            <TabsTrigger id="categories" className="flex-none px-0 text-sm">
              {t("tabs.categories")}
            </TabsTrigger>
            <TabsTrigger id="collections" className="flex-none px-0 text-sm">
              {t("tabs.collections")}
            </TabsTrigger>
            <TabsTrigger id="drafts" className="flex-none px-0 text-sm">
              {t("tabs.drafts")}
            </TabsTrigger>
            <TabsTrigger id="courses" className="flex-none px-0 text-sm">
              {t("tabs.courses")}
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
    </div>
  )
}
