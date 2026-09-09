import type { JSX, ReactNode } from "react"

import { Calendar } from "lucide-react"
import { useTranslations } from "use-intl/react"

import type { DummyPost } from "~/src/data/admin-blog"

import type { BlogPostStatus } from "~/src/presentation/components/custom/admin/constants/status-colors"

export const hasPostViews = (views: string | undefined): views is string => views !== undefined && views.length > 0

export const getGridMetaTextClass = (status: BlogPostStatus): string => {
  if (status === "scheduled") {
    return "text-muted-foreground"
  }

  return "text-muted-foreground"
}

export const GridPostMeta = ({ post }: { readonly post: DummyPost }): JSX.Element => {
  const t = useTranslations("pages.admin.blog")
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

export const renderTableDateCell = (post: DummyPost): ReactNode => {
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
