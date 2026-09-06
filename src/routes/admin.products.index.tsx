import { type JSX, Suspense } from "react"

import { useSuspenseQuery } from "@tanstack/react-query"
import { createFileRoute } from "@tanstack/react-router"
import { useTranslations } from "use-intl/react"

import { loadRouteMessages, routeHead } from "~/src/integrations/use-intl/i18n.metadata"

import { getCategoriesQuery } from "~/src/modules/category/use-cases/get-categories"
import { getProductsQuery } from "~/src/modules/product/use-cases/get-products"

import { ProductsPageTabs } from "~/src/presentation/components/custom/admin/products/components/products-page-tabs"
import { resolveProductTab } from "~/src/presentation/components/custom/admin/products/constants/product-tabs"

const PRODUCTS_CATALOG_FALLBACK = (
  <div className="w-full space-y-6">
    <div className="h-9 w-full max-w-md animate-pulse rounded-md border-b border-border bg-muted/20" />
    <div className="h-64 animate-pulse rounded-lg border border-border bg-muted/30" />
  </div>
)

const ProductsPage = (): JSX.Element => {
  const searchParams = Route.useSearch()
  const t = useTranslations("pages.admin.products")

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

type ProductsTranslator = Awaited<ReturnType<typeof useTranslations<"pages.admin.products">>>

const catalogLabels = (
  t: ProductsTranslator,
): Record<"all" | "categories" | "collections" | "courses" | "drafts" | "onetime" | "subscriptions", string> => ({
  all: t("tabs.all"),
  categories: t("tabs.categories"),
  collections: t("tabs.collections"),
  courses: t("tabs.courses"),
  drafts: t("tabs.drafts"),
  onetime: t("tabs.onetime"),
  subscriptions: t("tabs.subscriptions"),
})

const ProductsCatalog = ({ searchParams }: { searchParams: Record<string, string | undefined> }): JSX.Element => {
  const t = useTranslations("pages.admin.products")
  const params = searchParams
  const products = useSuspenseQuery(getProductsQuery).data
  const categories = useSuspenseQuery(getCategoriesQuery).data
  const activeTab = resolveProductTab(params["tab"])

  return <ProductsPageTabs activeTab={activeTab} categories={categories} labels={catalogLabels(t)} products={products} />
}

export const Route = createFileRoute("/admin/products/")({
  component: ProductsPage,
  head: routeHead,
  loader: async ({ context }) => {
    const [metadata] = await Promise.all([
      loadRouteMessages({
        metadataNamespace: "pages.admin.products",
        namespaces: [
          "auth.errors",
          "auth.validations",
          "category.errors",
          "category.validations",
          "pages.admin",
          "pages.admin.products",
          "pages.admin.products.create",
          "pages.admin.sidebar",
          "user.validations",
        ],
        pathname: "/admin/products",
        queryClient: context.queryClient,
      }),
      context.queryClient.query({ ...getCategoriesQuery, staleTime: "static" }),
      context.queryClient.query({ ...getProductsQuery, staleTime: "static" }),
    ])
    return metadata
  },
  staticData: {
    namespaces: [
      "auth.errors",
      "auth.validations",
      "category.errors",
      "category.validations",
      "pages.admin",
      "pages.admin.products",
      "pages.admin.products.create",
      "pages.admin.sidebar",
      "user.validations",
    ],
  },
  validateSearch: (search: Record<string, unknown>): Record<string, string | undefined> =>
    Object.fromEntries(Object.entries(search).filter((entry): entry is [string, string] => typeof entry[1] === "string")),
})
