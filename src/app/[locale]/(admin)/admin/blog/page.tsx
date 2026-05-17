import type { JSX } from "react"
import { Suspense } from "react"

import {
  Calendar,
  ChevronLeft,
  ChevronRight,
  Eye,
  FileEdit,
  FolderOpen,
  LayoutGrid,
  List,
  MoreHorizontal,
  Search,
  TrendingUp,
  Users,
} from "lucide-react"
import { getTranslations } from "next-intl/server"

import { Link } from "~/src/integrations/next-intl/i18n.navigation"

import { Badge } from "~/src/components/shadcn/badge"
import { Button } from "~/src/components/shadcn/button"
import { Card, CardContent } from "~/src/components/shadcn/card"
import { Checkbox } from "~/src/components/shadcn/checkbox"
import { Input } from "~/src/components/shadcn/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "~/src/components/shadcn/table"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "~/src/components/shadcn/tabs"

export async function generateMetadata({
  params,
}: Readonly<{
  params: Promise<{ locale: string }>
}>) {
  const { locale } = await params
  const t = await getTranslations({ locale, namespace: "admin.blog" })
  return {
    title: `${t("title")} | SaaSy Land`,
  }
}

// Dummy data extracted for reusability between Grid and Table views
const DUMMY_POSTS = [
  {
    id: "post-1",
    title: "Scaling Database Architecture for 10x Growth",
    description:
      "An in-depth technical dive into how our engineering team transitioned from a monolithic setup to a distributed architecture.",
    status: "published",
    category: "Engineering",
    categoryColor: "indigo",
    author: { name: "John Doe", initials: "JD" },
    date: "Oct 24",
    readTime: 8,
    views: "12.4k",
  },
  {
    id: "post-2",
    title: "Introducing Advanced Analytics Dashboard 2.0",
    description:
      "We've completely overhauled our reporting tools to give you deeper insights into your customer behavior and revenue metrics.",
    status: "draft",
    category: "Product Update",
    categoryColor: "emerald",
    author: { name: "Sarah Miller", initials: "SM" },
    date: "2h ago", // Treat as last edited for draft
    readTime: null,
    views: null,
  },
  {
    id: "post-3",
    title: "The Evolution of our Design System",
    description: "Building a cohesive visual language that scales across web, mobile, and internal administrative tools.",
    status: "published",
    category: "Design",
    categoryColor: "rose",
    author: { name: "Alex Lee", initials: "AL" },
    date: "Oct 18",
    readTime: 6,
    views: "8.1k",
  },
  {
    id: "post-4",
    title: "Announcing our Series B Funding Round",
    description: "We are thrilled to announce a $25M investment led by top tier venture firms to accelerate our growth.",
    status: "scheduled",
    category: "Company News",
    categoryColor: "blue",
    author: { name: "John Doe", initials: "JD" },
    date: "Tomorrow",
    readTime: null,
    views: null,
  },
  {
    id: "post-5",
    title: "Mastering Webhooks for Real-time Data",
    description: "Learn how to build resilient webhook systems that handle millions of events securely.",
    status: "published",
    category: "Tutorial",
    categoryColor: "fuchsia",
    author: { name: "Tom Wilson", initials: "TW" },
    date: "Oct 12",
    readTime: 12,
    views: "5.6k",
  },
  {
    id: "post-6",
    title: "Strategies for Reducing Customer Churn",
    description: "Proven retention tactics used by the fastest-growing SaaS companies.",
    status: "published",
    category: "Marketing",
    categoryColor: "amber",
    author: { name: "Sarah Miller", initials: "SM" },
    date: "Oct 05",
    readTime: 5,
    views: "22.1k",
  },
]

type SearchParams = Promise<{ [key: string]: string | string[] | undefined }>

export default function BlogAdminPage({ searchParams }: { searchParams: SearchParams }): JSX.Element {
  return (
    <Suspense
      fallback={<div className="flex h-64 w-full items-center justify-center text-muted-foreground text-sm">{"Loading content..."}</div>}
    >
      <BlogAdminContent searchParams={searchParams} />
    </Suspense>
  )
}

async function BlogAdminContent({ searchParams }: { searchParams: SearchParams }): Promise<JSX.Element> {
  const t = await getTranslations("admin.blog")
  const resolvedParams = await searchParams
  const view = resolvedParams.view === "table" ? "table" : "grid"

  return (
    <div className="fade-in-50 flex w-full animate-in flex-col space-y-8 pb-8 duration-500">
      {/* Page Title */}
      <div className="flex flex-col gap-4">
        <div>
          <h1 className="mb-1 font-medium text-2xl text-foreground tracking-tight">{t("title")}</h1>
          <p className="text-muted-foreground text-sm">{t("description")}</p>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3 sm:gap-6">
        <Card>
          <CardContent className="p-5">
            <div className="mb-4 flex items-center justify-between">
              <span className="font-medium text-muted-foreground text-xs">{t("stats.totalViews")}</span>
              <Eye className="size-4 text-muted-foreground" />
            </div>
            <div className="font-medium text-2xl text-foreground tracking-tight">{"45.2k"}</div>
            <div className="mt-2 flex items-center gap-1.5 font-medium text-emerald-500 text-xs">
              <TrendingUp className="size-3" />
              <span>{"+12.5%"}</span>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-5">
            <div className="mb-4 flex items-center justify-between">
              <span className="font-medium text-muted-foreground text-xs">{t("stats.subscribers")}</span>
              <Users className="size-4 text-muted-foreground" />
            </div>
            <div className="font-medium text-2xl text-foreground tracking-tight">{"8,409"}</div>
            <div className="mt-2 flex items-center gap-1.5 font-medium text-emerald-500 text-xs">
              <TrendingUp className="size-3" />
              <span>{"+4.2%"}</span>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-5">
            <div className="mb-4 flex items-center justify-between">
              <span className="font-medium text-muted-foreground text-xs">{t("stats.publishedPosts")}</span>
              <Calendar className="size-4 text-muted-foreground" />
            </div>
            <div className="font-medium text-2xl text-foreground tracking-tight">{"142"}</div>
            <div className="mt-2 flex items-center gap-1.5 font-medium text-muted-foreground text-xs">
              <span>{t("stats.draftsPending", { count: 12 })}</span>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Tabs, Filters & Search */}
      <Tabs defaultValue="all" className="w-full">
        <div className="flex flex-col gap-4 border-border border-b sm:flex-row sm:items-center sm:justify-between">
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

        <TabsContent value="all" className="mt-6 space-y-4 outline-none">
          <div className="flex flex-col gap-3 sm:flex-row">
            <div className="flex items-center gap-3">
              <Button variant="outline" size="sm" className="h-10 gap-2 whitespace-nowrap">
                <FolderOpen className="size-4 text-muted-foreground" />
                {t("actions.categories")}
              </Button>
              <div className="flex items-center gap-1 rounded-md border border-border/40 bg-secondary/30 p-1">
                <Link
                  href="/admin/blog?view=grid"
                  className={`flex h-7 w-7 items-center justify-center rounded-sm transition-colors ${
                    view === "grid" ? "bg-background shadow-sm" : "text-muted-foreground hover:text-foreground"
                  }`}
                  title={t("labels.gridView")}
                >
                  <LayoutGrid className="size-4" />
                </Link>
                <Link
                  href="/admin/blog?view=table"
                  className={`flex h-7 w-7 items-center justify-center rounded-sm transition-colors ${
                    view === "table" ? "bg-background shadow-sm" : "text-muted-foreground hover:text-foreground"
                  }`}
                  title={t("labels.tableView")}
                >
                  <List className="size-4" />
                </Link>
              </div>
            </div>

            <div className="group relative flex-1">
              <Search className="absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted-foreground transition-colors group-focus-within:text-foreground" />
              <Input placeholder={t("filters.search")} className="h-10 w-full pl-10" />
            </div>

            <Link href="/admin/blog/create" className="shrink-0">
              <Button size="sm" className="h-10 w-full gap-2 sm:w-auto">
                <FileEdit className="size-4" />
                {t("actions.writePost")}
              </Button>
            </Link>
          </div>

          {/* Dynamic Content View */}
          {view === "grid" ? (
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-3">
              {DUMMY_POSTS.map((post) => (
                <article
                  key={post.id}
                  className="group flex flex-col overflow-hidden rounded-2xl border border-border/40 bg-card transition-all duration-300 hover:border-border/80 hover:bg-card/60"
                >
                  <div
                    className={`relative flex aspect-[16/9] w-full items-start justify-between border-border/40 border-b bg-${post.categoryColor}-500/10 p-4`}
                  >
                    <Badge variant="secondary" className="flex items-center gap-1.5 border-border/50 bg-background/60 backdrop-blur-md">
                      <div
                        className={`size-1.5 rounded-full ${
                          post.status === "published" ? "bg-emerald-500" : post.status === "draft" ? "bg-amber-500" : "bg-blue-500"
                        }`}
                      />
                      {t(`badges.${post.status}`)}
                    </Badge>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="size-8 border border-border/50 bg-background/60 text-muted-foreground opacity-0 backdrop-blur-md transition-opacity hover:text-foreground group-hover:opacity-100"
                    >
                      <MoreHorizontal className="size-4" />
                    </Button>
                  </div>
                  <div className="flex flex-1 flex-col p-5">
                    <div className="mb-3 flex items-center gap-2">
                      <span className={`font-medium text-${post.categoryColor}-500 text-xs`}>{post.category}</span>
                      {post.views && (
                        <>
                          <span className="size-1 rounded-full bg-border" />
                          <span className="flex items-center gap-1 font-medium text-muted-foreground text-xs">
                            <Eye className="size-3" /> {post.views}
                          </span>
                        </>
                      )}
                    </div>
                    <h3
                      className={`mb-2 line-clamp-2 cursor-pointer font-medium text-foreground text-lg tracking-tight transition-colors group-hover:text-${post.categoryColor}-500`}
                    >
                      {post.title}
                    </h3>
                    <p className="mb-6 line-clamp-2 flex-1 text-muted-foreground text-sm">{post.description}</p>
                    <div className="mt-auto flex items-center justify-between border-border/40 border-t pt-4">
                      <div className="flex items-center gap-2.5">
                        <div className="flex size-6 items-center justify-center rounded-full border border-border/50 bg-secondary font-medium text-[10px] text-foreground">
                          {post.author.initials}
                        </div>
                        <span className="font-medium text-muted-foreground text-xs">{post.author.name}</span>
                      </div>
                      <div
                        className={`flex items-center gap-3 font-medium text-xs ${post.status === "scheduled" ? "text-blue-500" : "text-muted-foreground"}`}
                      >
                        {post.status === "scheduled" ? (
                          <>
                            <Calendar className="size-3" />
                            <span>{t("meta.publishesTomorrow")}</span>
                          </>
                        ) : post.status === "draft" ? (
                          <span>{t("meta.lastEdited", { time: post.date })}</span>
                        ) : (
                          <>
                            <span>{t("meta.publishedOn", { date: post.date })}</span>
                            {post.readTime && (
                              <>
                                <span className="size-1 rounded-full bg-border" />
                                <span>{t("meta.readTime", { minutes: post.readTime })}</span>
                              </>
                            )}
                          </>
                        )}
                      </div>
                    </div>
                  </div>
                </article>
              ))}
            </div>
          ) : (
            <Card className="overflow-hidden border-border/40">
              <Table>
                <TableHeader className="bg-secondary/30">
                  <TableRow>
                    <TableHead className="w-12 px-4 text-center">
                      <Checkbox className="mx-auto" />
                    </TableHead>
                    <TableHead className="w-[35%] font-medium">{t("table.postDetails")}</TableHead>
                    <TableHead className="font-medium">{t("table.status")}</TableHead>
                    <TableHead className="font-medium">{t("table.category")}</TableHead>
                    <TableHead className="font-medium">{t("table.author")}</TableHead>
                    <TableHead className="font-medium">{t("table.date")}</TableHead>
                    <TableHead className="font-medium">{t("table.views")}</TableHead>
                    <TableHead className="w-12 px-4 text-right" />
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {DUMMY_POSTS.map((post) => (
                    <TableRow key={post.id} className="group transition-colors hover:bg-muted/50">
                      <TableCell className="px-4 text-center">
                        <Checkbox className="mx-auto" />
                      </TableCell>
                      <TableCell className="py-4">
                        <div
                          className={`cursor-pointer truncate font-medium text-foreground transition-colors hover:text-${post.categoryColor}-500 max-w-[300px]`}
                        >
                          {post.title}
                        </div>
                        <div className="mt-1 text-muted-foreground text-xs">
                          {post.readTime ? t("meta.readTime", { minutes: post.readTime }) : "-"}
                        </div>
                      </TableCell>
                      <TableCell className="py-4">
                        <Badge variant="secondary" className="flex w-fit items-center gap-1.5 border-border/50">
                          <div
                            className={`size-1.5 rounded-full ${
                              post.status === "published" ? "bg-emerald-500" : post.status === "draft" ? "bg-amber-500" : "bg-blue-500"
                            }`}
                          />
                          {t(`badges.${post.status}`)}
                        </Badge>
                      </TableCell>
                      <TableCell className="py-4">
                        <Badge
                          variant="secondary"
                          className={`bg-${post.categoryColor}-500/10 text-${post.categoryColor}-500 border-transparent hover:bg-${post.categoryColor}-500/20`}
                        >
                          {post.category}
                        </Badge>
                      </TableCell>
                      <TableCell className="py-4">
                        <div className="flex items-center gap-2.5">
                          <div className="flex size-6 items-center justify-center rounded-full border border-border/50 bg-secondary font-medium text-[10px] text-foreground">
                            {post.author.initials}
                          </div>
                          <span className="font-medium text-foreground text-sm">{post.author.name}</span>
                        </div>
                      </TableCell>
                      <TableCell className={`py-4 ${post.status === "scheduled" ? "text-blue-500" : "text-muted-foreground"}`}>
                        {post.status === "scheduled" ? (
                          <div className="flex items-center gap-1.5">
                            <Calendar className="size-3.5" />
                            {post.date}
                          </div>
                        ) : (
                          post.date
                        )}
                      </TableCell>
                      <TableCell className="py-4 text-muted-foreground">
                        {post.views ? (
                          <div className="flex items-center gap-1.5">
                            <Eye className="size-3.5" />
                            {post.views}
                          </div>
                        ) : (
                          "-"
                        )}
                      </TableCell>
                      <TableCell className="px-4 py-4 text-right">
                        <Button
                          variant="ghost"
                          size="icon"
                          className="size-8 text-muted-foreground opacity-0 transition-all hover:bg-secondary hover:text-foreground focus:opacity-100 group-hover:opacity-100"
                        >
                          <MoreHorizontal className="size-4" />
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>

              {/* Pagination */}
              <div className="flex items-center justify-between border-border/40 border-t bg-secondary/10 px-4 py-3">
                <span className="font-medium text-muted-foreground text-xs">
                  {t.rich("pagination.info", {
                    start: 1,
                    end: 6,
                    total: 6,
                    highlight: (chunks) => <span className="text-foreground">{chunks}</span>,
                  })}
                </span>

                <div className="flex items-center gap-1">
                  <Button variant="ghost" size="icon" className="size-8 opacity-50" disabled>
                    <ChevronLeft className="size-4" />
                  </Button>
                  <Button variant="outline" size="sm" className="size-8 p-0">
                    {1}
                  </Button>
                  <Button variant="ghost" size="icon" className="size-8 opacity-50" disabled>
                    <ChevronRight className="size-4" />
                  </Button>
                </div>
              </div>
            </Card>
          )}

          {/* Load More (Grid View Only) */}
          {view === "grid" && (
            <div className="flex justify-center pt-4">
              <Button variant="outline" className="flex items-center gap-2">
                {t("actions.loadMore")}
              </Button>
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  )
}
