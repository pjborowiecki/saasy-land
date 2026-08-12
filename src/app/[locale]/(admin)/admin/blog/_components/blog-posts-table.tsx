import type { JSX } from "react"

import { ChevronLeft, ChevronRight } from "lucide-react"
import { getTranslations } from "next-intl/server"

import { Button } from "~/src/presentation/components/shadcn/button"
import { Card } from "~/src/presentation/components/shadcn/card"
import { Checkbox } from "~/src/presentation/components/shadcn/checkbox"
import { Table, TableContainer, TableBody, TableHead, TableHeader, TableRow } from "~/src/presentation/components/shadcn/table"

import { PAGINATION_FIRST_PAGE } from "~/src/app/[locale]/(admin)/admin/_lib/constants"
import { DUMMY_POSTS } from "~/src/app/[locale]/(admin)/admin/blog/_components/blog-post-data"
import { BlogPostTableRow } from "~/src/app/[locale]/(admin)/admin/blog/_components/blog-post-table-row"

function BlogPostsTableHeader({ t }: { readonly t: (key: string) => string }): JSX.Element {
  return (
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
}

export async function BlogPostsTable(): Promise<JSX.Element> {
  const t = await getTranslations("pages.admin.blog")

  return (
    <Card className="overflow-hidden border-border">
      <TableContainer>
        <Table>
          <BlogPostsTableHeader t={t} />
          <TableBody>
            {DUMMY_POSTS.map((post) => (
              <BlogPostTableRow key={post.id} post={post} />
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      <BlogPostsTablePagination />
    </Card>
  )
}

async function BlogPostsTablePagination(): Promise<JSX.Element> {
  const t = await getTranslations("pages.admin.blog")

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
