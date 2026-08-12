import type { Metadata } from "next"
import { Suspense, type JSX } from "react"

import { getTranslations } from "next-intl/server"

import { getCategories } from "~/src/modules/category/use-cases/get-categories.use-case"
import { getProducts } from "~/src/modules/product/use-cases/get-products.use-case"

import { ProductsPageTabs } from "~/src/app/[locale]/(admin)/admin/products/_components/products-page-tabs"
import { resolveProductTab } from "~/src/app/[locale]/(admin)/admin/products/_lib/product-tabs"

const PRODUCTS_CATALOG_FALLBACK = (
  <div className="w-full space-y-6">
    <div className="h-9 w-full max-w-md animate-pulse rounded-md border-b border-border bg-muted/20" />
    <div className="h-64 animate-pulse rounded-lg border border-border bg-muted/30" />
  </div>
)

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations("pages.admin.products")

  return {
    description: t("metadata.description"),
    title: t("metadata.title"),
  }
}

export default async function ProductsPage({ searchParams }: PageProps<"/[locale]/admin/products">): Promise<JSX.Element> {
  const t = await getTranslations("pages.admin.products")

  return (
    <div className="flex w-full animate-in flex-col space-y-8 duration-500 fade-in-50">
      <div className="flex flex-col gap-4">
        <div>
          <h1 className="text-statement font-semibold text-foreground">{t("title")}</h1>
          <p className="text-sm text-muted-foreground">{t("description")}</p>
        </div>
      </div>

      <Suspense fallback={PRODUCTS_CATALOG_FALLBACK}>
        <ProductsCatalog searchParams={searchParams} />
      </Suspense>
    </div>
  )
}

type ProductsTranslator = Awaited<ReturnType<typeof getTranslations<"pages.admin.products">>>

function catalogLabels(
  t: ProductsTranslator,
): Record<"all" | "categories" | "collections" | "courses" | "drafts" | "onetime" | "subscriptions", string> {
  return {
    all: t("tabs.all"),
    categories: t("tabs.categories"),
    collections: t("tabs.collections"),
    courses: t("tabs.courses"),
    drafts: t("tabs.drafts"),
    onetime: t("tabs.onetime"),
    subscriptions: t("tabs.subscriptions"),
  }
}

async function ProductsCatalog({ searchParams }: Pick<PageProps<"/[locale]/admin/products">, "searchParams">): Promise<JSX.Element> {
  const [t, params, products, categories] = await Promise.all([
    getTranslations("pages.admin.products"),
    searchParams,
    getProducts(),
    getCategories(),
  ])
  const activeTab = resolveProductTab(params["tab"])

  return <ProductsPageTabs activeTab={activeTab} categories={categories} labels={catalogLabels(t)} products={products} />
}
