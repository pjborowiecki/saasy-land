import type { JSX } from "react"

import { ChevronLeft, ChevronRight } from "lucide-react"
import { useTranslations } from "use-intl/react"

import { Button } from "~/src/presentation/components/shadcn/button"
import { Card } from "~/src/presentation/components/shadcn/card"
import { Checkbox } from "~/src/presentation/components/shadcn/checkbox"
import { Table, TableBody, TableContainer, TableHead, TableHeader, TableRow } from "~/src/presentation/components/shadcn/table"

import { BlogPostTableRow } from "~/src/presentation/components/custom/admin/blog/components/blog-post-table-row"
import { useDemoPosts } from "~/src/presentation/components/custom/admin/blog/hooks/use-demo-posts"
import { PAGINATION_FIRST_PAGE } from "~/src/presentation/components/custom/admin/constants/constants"

const BlogPostsTableHeader = ({ t }: { readonly t: (key: string) => string }): JSX.Element => (
  <TableHeader className="bg-muted/40">
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
)

export const BlogPostsTable = (): JSX.Element => {
  const posts = useDemoPosts()
  const t = useTranslations("pages.admin.blog")

  return (
    <Card className="overflow-hidden border-border">
      <TableContainer>
        <Table>
          <BlogPostsTableHeader t={t} />
          <TableBody>
            {posts.map((post) => (
              <BlogPostTableRow key={post.id} post={post} />
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      <BlogPostsTablePagination />
    </Card>
  )
}

const BlogPostsTablePagination = (): JSX.Element => {
  const t = useTranslations("pages.admin.blog")

  return (
    <div className="flex items-center justify-between border-t border-border bg-muted/40 px-4 py-3">
      <span className="text-xs font-medium text-muted-foreground">
        {t("pagination.info", {
          end: 6,
          start: 1,
          total: 6,
        })}
      </span>

      <div className="flex items-center gap-1">
        <Button variant="ghost" size="icon" className="size-8 opacity-50" isDisabled>
          <ChevronLeft className="size-4" />
        </Button>
        <Button variant="outline" size="sm" className="size-8 p-0">
          {PAGINATION_FIRST_PAGE}
        </Button>
        <Button variant="ghost" size="icon" className="size-8 opacity-50" isDisabled>
          <ChevronRight className="size-4" />
        </Button>
      </div>
    </div>
  )
}
