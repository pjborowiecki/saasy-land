import type { JSX } from "react"

import { Eye, MoreHorizontal } from "lucide-react"
import { useTranslations } from "use-intl/react"

import type { DummyPost } from "~/src/data/admin-blog"

import { Badge } from "~/src/presentation/components/shadcn/badge"
import { Button } from "~/src/presentation/components/shadcn/button"
import { Checkbox } from "~/src/presentation/components/shadcn/checkbox"
import { TableCell, TableRow } from "~/src/presentation/components/shadcn/table"

import {
  getGridMetaTextClass,
  hasPostViews,
  renderTableDateCell,
} from "~/src/presentation/components/custom/admin/blog/components/blog-post-helpers"
import { getBlogPostStatusDotClass } from "~/src/presentation/components/custom/admin/constants/status-colors"

interface BlogPostTableRowProps {
  readonly post: DummyPost
}

export const BlogPostTableRow = ({ post }: BlogPostTableRowProps): JSX.Element => {
  const t = useTranslations("pages.admin.blog")

  return (
    <TableRow className="group transition-colors hover:bg-muted/50">
      <TableCell className="px-4 text-center">
        <Checkbox className="mx-auto" />
      </TableCell>
      <TableCell className="py-4">
        <div className="max-w-75 cursor-pointer truncate font-medium text-foreground transition-colors duration-200 ease-exp hover:text-muted-foreground">
          {post.title}
        </div>
        <div className="mt-1 text-xs text-muted-foreground">
          {post.readTime === undefined ? "-" : t("meta.readTime", { minutes: post.readTime })}
        </div>
      </TableCell>
      <TableCell className="py-4">
        <Badge
          className="flex w-fit items-center gap-1.5 rounded-md border-border bg-muted px-2 py-0.5 text-[0.6875rem] font-medium"
          variant="secondary"
        >
          <span aria-hidden className={`size-1.5 rounded-full ${getBlogPostStatusDotClass(post.status)}`} />
          {t(`badges.${post.status}`)}
        </Badge>
      </TableCell>
      <TableCell className="py-4">
        <span className="font-mono text-label text-muted-foreground uppercase">{post.category}</span>
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
          className="size-8 text-muted-foreground opacity-0 transition-all group-hover:opacity-100 hover:bg-muted hover:text-foreground focus:opacity-100"
        >
          <MoreHorizontal className="size-4" />
        </Button>
      </TableCell>
    </TableRow>
  )
}

const BlogPostTableAuthor = ({ post }: BlogPostTableRowProps): JSX.Element => (
  <div className="flex items-center gap-2.5">
    <span aria-hidden className="flex size-6 items-center justify-center rounded-md bg-muted text-[0.625rem] font-semibold text-foreground">
      {post.author.initials}
    </span>
    <span className="text-foreground">{post.author.name}</span>
  </div>
)

const BlogPostTableViews = ({ views }: { readonly views: string | undefined }): JSX.Element => {
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
