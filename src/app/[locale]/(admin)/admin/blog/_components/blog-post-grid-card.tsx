import type { JSX } from "react"

import { Eye, MoreHorizontal } from "lucide-react"
import { getTranslations } from "next-intl/server"

import { Badge } from "~/src/presentation/components/shadcn/badge"
import { Button } from "~/src/presentation/components/shadcn/button"

import { getBlogPostStatusDotClass } from "~/src/app/[locale]/(admin)/admin/_lib/status-colors"
import type { DummyPost } from "~/src/app/[locale]/(admin)/admin/blog/_components/blog-post-data"
import { getGridMetaTextClass, GridPostMeta, hasPostViews } from "~/src/app/[locale]/(admin)/admin/blog/_components/blog-post-helpers"

interface BlogPostGridCardProps {
  readonly post: DummyPost
}

/**
 * No cover.
 *
 * The card used to open with a 16:9 block tinted by the post's category hue, so a grid of six
 * posts showed six large pastel rectangles in indigo, emerald, rose, blue, fuchsia and amber.
 * They were not images and they were not going to become images; they were coloured space where
 * a thumbnail would go, which is the most expensive kind of nothing on a page.
 *
 * Without it the card is what an editor actually scans: state, category, title, summary, who and
 * when. If real cover art arrives, it belongs exactly where the block was.
 */
export async function BlogPostGridCard({ post }: BlogPostGridCardProps): Promise<JSX.Element> {
  const t = await getTranslations("pages.admin.blog")

  return (
    <article className="group flex flex-col rounded-xl border border-border bg-card p-5 transition-colors duration-300 ease-exp hover:border-muted-foreground/25">
      <div className="flex items-start justify-between gap-3">
        <Badge className="gap-1.5 rounded-md border-border bg-muted px-2 py-0.5 text-[0.6875rem] font-medium" variant="secondary">
          <span aria-hidden className={`size-1.5 rounded-full ${getBlogPostStatusDotClass(post.status)}`} />
          {t(`badges.${post.status}`)}
        </Badge>
        <Button
          className="-mt-1 -mr-1 size-7 text-muted-foreground opacity-0 transition-opacity duration-200 ease-exp group-hover:opacity-100 hover:text-foreground"
          size="icon"
          variant="ghost"
        >
          <MoreHorizontal className="size-4" strokeWidth={1.75} />
        </Button>
      </div>

      <div className="mt-5 flex items-center gap-2.5">
        <span className="font-mono text-label text-muted-foreground uppercase">{post.category}</span>
        {hasPostViews(post.views) ? (
          <span className="flex items-center gap-1 font-mono text-[0.6875rem] text-muted-foreground tabular-nums">
            <Eye aria-hidden className="size-3" strokeWidth={1.75} /> {post.views}
          </span>
        ) : undefined}
      </div>

      <h3 className="mt-2 line-clamp-2 cursor-pointer text-title text-balance text-foreground">{post.title}</h3>
      <p className="mt-2 mb-6 line-clamp-2 flex-1 text-body-sm text-pretty text-muted-foreground">{post.description}</p>

      <div className="mt-auto flex items-center justify-between border-t border-border pt-4">
        <div className="flex items-center gap-2.5">
          <span
            aria-hidden
            className="flex size-6 items-center justify-center rounded-md bg-muted text-[0.625rem] font-semibold text-foreground"
          >
            {post.author.initials}
          </span>
          <span className="text-xs text-muted-foreground">{post.author.name}</span>
        </div>
        <div className={`flex items-center gap-3 text-xs ${getGridMetaTextClass(post.status)}`}>
          <GridPostMeta post={post} />
        </div>
      </div>
    </article>
  )
}
