import type { JSX } from "react"

import { Eye, MoreHorizontal } from "lucide-react"
import { getTranslations } from "next-intl/server"

import { Badge } from "~/src/presentation/components/shadcn/badge"
import { Button } from "~/src/presentation/components/shadcn/button"
import { Checkbox } from "~/src/presentation/components/shadcn/checkbox"
import { TableCell, TableRow } from "~/src/presentation/components/shadcn/table"

import { getBlogPostStatusDotClass } from "~/src/app/[locale]/(admin)/admin/_lib/status-colors"
import type { DummyPost } from "~/src/app/[locale]/(admin)/admin/blog/_components/blog-post-data"
import {
  getGridMetaTextClass,
  hasPostViews,
  renderTableDateCell,
} from "~/src/app/[locale]/(admin)/admin/blog/_components/blog-post-helpers"

interface BlogPostTableRowProps {
  readonly post: DummyPost
}

export async function BlogPostTableRow({ post }: BlogPostTableRowProps): Promise<JSX.Element> {
  const t = await getTranslations("pages.admin.blog")

  return (
    <TableRow className="group transition-colors hover:bg-muted/50">
      <TableCell className="px-4 text-center">
        <Checkbox className="mx-auto" />
      </TableCell>
      <TableCell className="py-4">
        <div
          className={`cursor-pointer truncate font-medium text-foreground transition-colors hover:text-${post.categoryColor}-500 max-w-[300px]`}
        >
          {post.title}
        </div>
        <div className="mt-1 text-xs text-muted-foreground">
          {post.readTime === undefined ? "-" : t("meta.readTime", { minutes: post.readTime })}
        </div>
      </TableCell>
      <TableCell className="py-4">
        <Badge variant="secondary" className="flex w-fit items-center gap-1.5 border-border/50">
          <div className={`size-1.5 rounded-full ${getBlogPostStatusDotClass(post.status)}`} />
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
        <BlogPostTableAuthor post={post} />
      </TableCell>
      <TableCell className={`py-4 ${getGridMetaTextClass(post.status)}`}>{renderTableDateCell(post)}</TableCell>
      <TableCell className="py-4 text-muted-foreground">
        <BlogPostTableViews views={post.views} />
      </TableCell>
      <TableCell className="px-4 py-4 text-right">
        <Button
          variant="ghost"
          size="icon"
          className="size-8 text-muted-foreground opacity-0 transition-all group-hover:opacity-100 hover:bg-secondary hover:text-foreground focus:opacity-100"
        >
          <MoreHorizontal className="size-4" />
        </Button>
      </TableCell>
    </TableRow>
  )
}

function BlogPostTableAuthor({ post }: BlogPostTableRowProps): JSX.Element {
  return (
    <div className="flex items-center gap-2.5">
      <div className="flex size-6 items-center justify-center rounded-full border border-border/50 bg-secondary text-[10px] font-medium text-foreground">
        {post.author.initials}
      </div>
      <span className="text-sm font-medium text-foreground">{post.author.name}</span>
    </div>
  )
}

function BlogPostTableViews({ views }: { readonly views: string | undefined }): JSX.Element {
  if (!hasPostViews(views)) {
    return <>-</>
  }

  return (
    <div className="flex items-center gap-1.5">
      <Eye className="size-3.5" />
      {views}
    </div>
  )
}
