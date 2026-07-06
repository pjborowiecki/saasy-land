import { type JSX, Suspense } from "react"

import { getTranslations } from "next-intl/server"

import { Tabs, TabsList, TabsTrigger } from "~/src/components/shadcn/tabs"

import { BlogAdminStats } from "~/src/app/[locale]/(admin)/admin/blog/_components/blog-admin-stats"
import { BlogPostsPanel } from "~/src/app/[locale]/(admin)/admin/blog/_components/blog-posts-panel"

const BLOG_ADMIN_FALLBACK = (
  <div className="flex h-64 w-full items-center justify-center text-sm text-muted-foreground">Loading content...</div>
)

type SearchParams = Promise<Record<string, string | string[] | undefined>>

export async function generateMetadata({
  params,
}: Readonly<{
  params: Promise<{ locale: string }>
}>) {
  const { locale } = await params
  const t = await getTranslations({ locale, namespace: "pages.admin.blog" })
  return {
    title: `${t("title")} | SaaSy Land`,
  }
}

export default function BlogAdminPage({ searchParams }: { searchParams: SearchParams }): JSX.Element {
  return (
    <Suspense fallback={BLOG_ADMIN_FALLBACK}>
      <BlogAdminContent searchParams={searchParams} />
    </Suspense>
  )
}

async function BlogAdminContent({ searchParams }: { searchParams: SearchParams }): Promise<JSX.Element> {
  const t = await getTranslations("pages.admin.blog")
  const resolvedParams = await searchParams
  const view = resolvedParams["view"] === "table" ? "table" : "grid"

  return (
    <div className="flex w-full animate-in flex-col space-y-8 pb-8 duration-500 fade-in-50">
      <div className="flex flex-col gap-4">
        <div>
          <h1 className="mb-1 text-2xl font-medium tracking-tight text-foreground">{t("title")}</h1>
          <p className="text-sm text-muted-foreground">{t("description")}</p>
        </div>
      </div>

      <BlogAdminStats />

      <Tabs defaultValue="all" className="w-full">
        <div className="flex flex-col gap-4 border-b border-border sm:flex-row sm:items-center sm:justify-between">
          <TabsList variant="line" className="no-scrollbar flex-1 justify-start gap-6 overflow-x-auto">
            <TabsTrigger value="all" className="flex-none px-0 text-sm">
              {t("filters.all")}
            </TabsTrigger>
            <TabsTrigger value="published" className="flex-none px-0 text-sm">
              {t("filters.published")}
            </TabsTrigger>
            <TabsTrigger value="drafts" className="flex-none px-0 text-sm">
              {t("filters.drafts")}
            </TabsTrigger>
            <TabsTrigger value="scheduled" className="flex-none px-0 text-sm">
              {t("filters.scheduled")}
            </TabsTrigger>
          </TabsList>
        </div>

        <BlogPostsPanel view={view} />
      </Tabs>
    </div>
  )
}
