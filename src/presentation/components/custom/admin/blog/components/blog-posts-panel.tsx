import type { JSX } from "react"

import { Link } from "@tanstack/react-router"
import { FileEdit, FolderOpen, LayoutGrid, List, Search } from "lucide-react"
import { useTranslations } from "use-intl/react"

import { Button } from "~/src/presentation/components/shadcn/button"
import { Input } from "~/src/presentation/components/shadcn/input"
import { TabsContent } from "~/src/presentation/components/shadcn/tabs"

import { BlogPostsGrid } from "~/src/presentation/components/custom/admin/blog/components/blog-posts-grid"
import { BlogPostsTable } from "~/src/presentation/components/custom/admin/blog/components/blog-posts-table"

interface BlogPostsPanelProps {
  readonly view: "grid" | "table"
}

export const BlogPostsPanel = ({ view }: BlogPostsPanelProps): JSX.Element => {
  const t = useTranslations("pages.admin.blog")
  return (
    <TabsContent id="all" className="mt-6 space-y-4 outline-none">
      <div className="flex flex-col gap-3 sm:flex-row">
        <div className="flex items-center gap-3">
          <Button variant="outline" size="sm" className="h-10 gap-2 whitespace-nowrap">
            <FolderOpen className="size-4 text-muted-foreground" />
            {t("actions.categories")}
          </Button>
          <div className="flex items-center gap-1 rounded-md border border-border bg-muted/40 p-1">
            <Link
              to="/admin/blog"
              search={{ view: "grid" }}
              className={`flex h-7 w-7 items-center justify-center rounded-sm transition-colors ${
                view === "grid" ? "bg-background shadow-sm" : "text-muted-foreground hover:text-foreground"
              }`}
              title={t("labels.gridView")}
            >
              <LayoutGrid className="size-4" />
            </Link>
            <Link
              to="/admin/blog"
              search={{ view: "table" }}
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

        <Link to="/admin/blog/create" className="shrink-0">
          <Button size="sm" className="h-10 w-full gap-2 sm:w-auto">
            <FileEdit className="size-4" />
            {t("actions.writePost")}
          </Button>
        </Link>
      </div>

      {view === "grid" ? <BlogPostsGrid /> : <BlogPostsTable />}

      {view === "grid" && (
        <div className="flex justify-center pt-4">
          <Button variant="outline" className="flex items-center gap-2">
            {t("actions.loadMore")}
          </Button>
        </div>
      )}
    </TabsContent>
  )
}
