import { type JSX, Suspense } from "react"

import { getTranslations } from "next-intl/server"

import { Tabs, TabsList, TabsTrigger } from "~/src/presentation/components/shadcn/tabs"

import { BlogAdminStats } from "~/src/app/[locale]/(admin)/admin/blog/_components/blog-admin-stats"
import { BlogPostsPanel } from "~/src/app/[locale]/(admin)/admin/blog/_components/blog-posts-panel"

const BLOG_POSTS_FALLBACK = <div className="mt-6 h-64 w-full animate-pulse rounded-lg border border-border bg-muted/30" />

type SearchParams = Promise<Record<string, string | string[] | undefined>>

export async function generateMetadata() {
  const t = await getTranslations("pages.admin.blog")
  return {
    title: `${t("title")} | SaaSy Land`,
  }
}

export default async function BlogAdminPage({ searchParams }: { searchParams: SearchParams }): Promise<JSX.Element> {
  const t = await getTranslations("pages.admin.blog")

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

async function BlogPostsView({ searchParams }: { searchParams: SearchParams }): Promise<JSX.Element> {
  const resolvedParams = await searchParams
  const view = resolvedParams["view"] === "table" ? "table" : "grid"

  return <BlogPostsPanel view={view} />
}
