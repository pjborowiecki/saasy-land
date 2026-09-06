import { type JSX, Suspense } from "react"

import { createFileRoute } from "@tanstack/react-router"
import { useTranslations } from "use-intl/react"

import { loadRouteMessages, routeHead } from "~/src/integrations/use-intl/i18n.metadata"

import { Tabs, TabsList, TabsTrigger } from "~/src/presentation/components/shadcn/tabs"

import { BlogAdminStats } from "~/src/presentation/components/custom/admin/blog/components/blog-admin-stats"
import { BlogPostsPanel } from "~/src/presentation/components/custom/admin/blog/components/blog-posts-panel"

const BLOG_POSTS_FALLBACK = <div className="mt-6 h-64 w-full animate-pulse rounded-lg border border-border bg-muted/30" />

type SearchParams = Record<string, string | undefined>

const BlogAdminPage = (): JSX.Element => {
  const searchParams = Route.useSearch()
  const t = useTranslations("pages.admin.blog")

  return (
    <div className="flex w-full animate-in flex-col space-y-8 pb-8 duration-500 fade-in-50">
      <div className="flex flex-col gap-4">
        <div>
          <h1 className="text-statement font-semibold text-foreground">{t("title")}</h1>
          <p className="text-sm text-muted-foreground">{t("description")}</p>
        </div>
      </div>

      <BlogAdminStats />

      <Tabs defaultSelectedKey="all" className="w-full">
        <div className="flex flex-col gap-4 border-b border-border sm:flex-row sm:items-center sm:justify-between">
          <TabsList variant="line" className="no-scrollbar flex-1 justify-start gap-6 overflow-x-auto">
            <TabsTrigger id="all" className="flex-none px-0 text-sm">
              {t("filters.all")}
            </TabsTrigger>
            <TabsTrigger id="published" className="flex-none px-0 text-sm">
              {t("filters.published")}
            </TabsTrigger>
            <TabsTrigger id="drafts" className="flex-none px-0 text-sm">
              {t("filters.drafts")}
            </TabsTrigger>
            <TabsTrigger id="scheduled" className="flex-none px-0 text-sm">
              {t("filters.scheduled")}
            </TabsTrigger>
          </TabsList>
        </div>

        <Suspense fallback={BLOG_POSTS_FALLBACK}>
          <BlogPostsView searchParams={searchParams} />
        </Suspense>
      </Tabs>
    </div>
  )
}

const BlogPostsView = ({ searchParams }: { searchParams: SearchParams }): JSX.Element => {
  const resolvedParams = searchParams
  const view = resolvedParams["view"] === "table" ? "table" : "grid"

  return <BlogPostsPanel view={view} />
}

export const Route = createFileRoute("/admin/blog/")({
  component: BlogAdminPage,
  head: routeHead,
  loader: ({ context }) =>
    loadRouteMessages({
      metadataNamespace: "pages.admin.blog",
      namespaces: [
        "auth.errors",
        "auth.validations",
        "pages.admin",
        "pages.admin.blog",
        "pages.admin.blog.create",
        "pages.admin.sidebar",
        "user.validations",
      ],
      pathname: "/admin/blog",
      queryClient: context.queryClient,
    }),
  staticData: {
    namespaces: [
      "auth.errors",
      "auth.validations",
      "pages.admin",
      "pages.admin.blog",
      "pages.admin.blog.create",
      "pages.admin.sidebar",
      "user.validations",
    ],
  },
  validateSearch: (search: Record<string, unknown>): Record<string, string | undefined> =>
    Object.fromEntries(Object.entries(search).filter((entry): entry is [string, string] => typeof entry[1] === "string")),
})
