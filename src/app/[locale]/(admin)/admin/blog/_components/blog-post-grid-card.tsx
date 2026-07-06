import type { JSX } from "react"

import { Eye, MoreHorizontal } from "lucide-react"
import { getTranslations } from "next-intl/server"

import { Badge } from "~/src/components/shadcn/badge"
import { Button } from "~/src/components/shadcn/button"

import { getBlogPostStatusDotClass } from "~/src/app/[locale]/(admin)/admin/_lib/status-colors"
import type { DummyPost } from "~/src/app/[locale]/(admin)/admin/blog/_components/blog-post-data"
import { getGridMetaTextClass, GridPostMeta, hasPostViews } from "~/src/app/[locale]/(admin)/admin/blog/_components/blog-post-helpers"

interface BlogPostGridCardProps {
  readonly post: DummyPost
}

export async function BlogPostGridCard({ post }: BlogPostGridCardProps): Promise<JSX.Element> {
  const t = await getTranslations("pages.admin.blog")

  return (
    <article className="group flex flex-col overflow-hidden rounded-2xl border border-border/40 bg-card transition-all duration-300 hover:border-border/80 hover:bg-card/60">
      <div
        className={`relative flex aspect-[16/9] w-full items-start justify-between border-b border-border/40 bg-${post.categoryColor}-500/10 p-4`}
      >
        <Badge variant="secondary" className="flex items-center gap-1.5 border-border/50 bg-background/60 backdrop-blur-md">
          <div className={`size-1.5 rounded-full ${getBlogPostStatusDotClass(post.status)}`} />
          {t(`badges.${post.status}`)}
        </Badge>
        <Button
          variant="ghost"
          size="icon"
          className="size-8 border border-border/50 bg-background/60 text-muted-foreground opacity-0 backdrop-blur-md transition-opacity group-hover:opacity-100 hover:text-foreground"
        >
          <MoreHorizontal className="size-4" />
        </Button>
      </div>
      <div className="flex flex-1 flex-col p-5">
        <BlogPostGridCardMeta post={post} />
        <h3
          className={`mb-2 line-clamp-2 cursor-pointer text-lg font-medium tracking-tight text-foreground transition-colors group-hover:text-${post.categoryColor}-500`}
        >
          {post.title}
        </h3>
        <p className="mb-6 line-clamp-2 flex-1 text-sm text-muted-foreground">{post.description}</p>
        <BlogPostGridCardFooter post={post} />
      </div>
    </article>
  )
}

function BlogPostGridCardMeta({ post }: BlogPostGridCardProps): JSX.Element {
  return (
    <div className="mb-3 flex items-center gap-2">
      <span className={`font-medium text-${post.categoryColor}-500 text-xs`}>{post.category}</span>
      {hasPostViews(post.views) && (
        <>
          <span className="size-1 rounded-full bg-border" />
          <span className="flex items-center gap-1 text-xs font-medium text-muted-foreground">
            <Eye className="size-3" /> {post.views}
          </span>
        </>
      )}
    </div>
  )
}

function BlogPostGridCardFooter({ post }: BlogPostGridCardProps): JSX.Element {
  return (
    <div className="mt-auto flex items-center justify-between border-t border-border/40 pt-4">
      <div className="flex items-center gap-2.5">
        <div className="flex size-6 items-center justify-center rounded-full border border-border/50 bg-secondary text-[10px] font-medium text-foreground">
          {post.author.initials}
        </div>
        <span className="text-xs font-medium text-muted-foreground">{post.author.name}</span>
      </div>
      <div className={`flex items-center gap-3 text-xs font-medium ${getGridMetaTextClass(post.status)}`}>
        <GridPostMeta post={post} />
      </div>
    </div>
  )
}
