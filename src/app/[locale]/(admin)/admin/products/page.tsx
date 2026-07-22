/* eslint-disable react-perf/jsx-no-new-object-as-prop -- RSC page builds i18n label bag once per render */
import type { Metadata } from "next"
import { Suspense, type JSX } from "react"

import { getTranslations } from "next-intl/server"

import { db } from "~/src/platform/db/client"

import type { ProductDto } from "~/src/modules/catalog/application/dto/product.dto"
import { listProducts } from "~/src/modules/catalog/application/use-cases/list-products/list-products.handler"
import { createDrizzleProductRepository } from "~/src/modules/catalog/infrastructure/persistence/repositories/create-drizzle-product-repository"

import { ADMIN_CATEGORY_ROWS, ADMIN_COLLECTION_ROWS } from "~/src/app/[locale]/(admin)/admin/_lib/mock-data"
import { ProductsPageTabs } from "~/src/app/[locale]/(admin)/admin/products/_components/products-page-tabs"

const EMPTY_PRODUCT_DTOS: readonly ProductDto[] = []

const PRODUCTS_CATALOG_FALLBACK = <div className="mt-6 h-64 animate-pulse rounded-lg border border-border/60 bg-muted/30" />

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

  return (
    <div className="flex w-full animate-in flex-col space-y-8 duration-500 fade-in-50">
      <div className="flex flex-col gap-4">
        <div>
          <h1 className="mb-1 text-2xl font-medium tracking-tight text-foreground">{t("title")}</h1>
          <p className="text-sm text-muted-foreground">{t("description")}</p>
        </div>
      </div>

      <Suspense fallback={PRODUCTS_CATALOG_FALLBACK}>
        <ProductsCatalog
          labels={{
            all: t("tabs.all"),
            categories: t("tabs.categories"),
            collections: t("tabs.collections"),
            courses: t("tabs.courses"),
            drafts: t("tabs.drafts"),
            onetime: t("tabs.onetime"),
            subscriptions: t("tabs.subscriptions"),
          }}
        />
      </Suspense>
    </div>
  )
}

async function ProductsCatalog({
  labels,
}: {
  readonly labels: {
    readonly all: string
    readonly categories: string
    readonly collections: string
    readonly courses: string
    readonly drafts: string
    readonly onetime: string
    readonly subscriptions: string
  }
}): Promise<JSX.Element> {
  const listed = await listProducts({ products: createDrizzleProductRepository(db) })
  const catalogDtos = listed.ok ? listed.value : EMPTY_PRODUCT_DTOS

  return <ProductsPageTabs categories={ADMIN_CATEGORY_ROWS} catalogDtos={catalogDtos} collections={ADMIN_COLLECTION_ROWS} labels={labels} />
}
