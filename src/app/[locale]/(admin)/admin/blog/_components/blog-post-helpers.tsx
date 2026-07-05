import type { JSX, ReactNode } from "react"

import { Calendar } from "lucide-react"
import { getTranslations } from "next-intl/server"

import { EMPTY_PATH_PARTS_LENGTH } from "~/src/lib/admin/constants"
import type { BlogPostStatus } from "~/src/lib/admin/status-colors"

import type { DummyPost } from "~/src/app/[locale]/(admin)/admin/blog/_components/blog-post-data"

export function hasPostViews(views: string | undefined): views is string {
  return views !== undefined && views.length > EMPTY_PATH_PARTS_LENGTH
}

export function getGridMetaTextClass(status: BlogPostStatus): string {
  if (status === "scheduled") {
    return "text-blue-500"
  }

  return "text-muted-foreground"
}

export async function GridPostMeta({ post }: { readonly post: DummyPost }): Promise<JSX.Element> {
  const t = await getTranslations("admin.blog")
  if (post.status === "scheduled") {
    return (
      <>
        <Calendar className="size-3" />
        <span>{t("meta.publishesTomorrow")}</span>
      </>
    )
  }

  if (post.status === "draft") {
    return <span>{t("meta.lastEdited", { time: post.date })}</span>
  }

  return (
    <>
      <span>{t("meta.publishedOn", { date: post.date })}</span>
      {post.readTime !== undefined && (
        <>
          <span className="size-1 rounded-full bg-border" />
          <span>{t("meta.readTime", { minutes: post.readTime })}</span>
        </>
      )}
    </>
  )
}

export function renderTableDateCell(post: DummyPost): ReactNode {
  if (post.status === "scheduled") {
    return (
      <div className="flex items-center gap-1.5">
        <Calendar className="size-3.5" />
        {post.date}
      </div>
    )
  }

  return post.date
}
