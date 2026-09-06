import type { JSX, ReactNode } from "react"

import { Link } from "@tanstack/react-router"
import { useFormatter, useTranslations } from "use-intl/react"

import type { BlogPostSummary as BlogPost } from "~/src/integrations/fumadocs/fumadocs.blog"

import { summaryFromFrontmatter } from "~/src/lib/blog"

import { HighlightGroup, HighlightItem } from "~/src/presentation/components/custom/landing-page/components/hover-highlight"

interface PostRowProps {
  readonly post: BlogPost
}

export const PostRow = ({ post }: PostRowProps): JSX.Element => {
  const t = useTranslations("pages.blog")
  const format = useFormatter()

  const { data, url } = post
  const { title } = data

  const tags = data.tags !== undefined && data.tags.length > 0 ? data.tags.join(" · ") : undefined

  const date = format.dateTime(new Date(data.date), { day: "numeric", month: "short", year: "numeric" })
  const minutes = data.readingTimeMinutes
  const summary = summaryFromFrontmatter(data)

  return (
    <HighlightItem
      className="group"
      contentClassName="grid gap-x-10 gap-y-2 px-4 py-7 md:grid-cols-[10rem_1fr] md:items-baseline md:px-6 md:py-8"
      id={url}
    >
      <div className="font-mono text-spec text-muted-foreground tabular-nums">
        <p>{date}</p>
        {minutes !== undefined && minutes > 0 && <p className="mt-1 text-muted-foreground/60">{t("post.readingTime", { minutes })}</p>}
      </div>
      <div className="min-w-0">
        <h2 className="text-title text-balance text-foreground">
          <Link
            className="after:absolute after:inset-0 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-ring"
            to={url}
          >
            {title}
          </Link>
        </h2>
        {summary !== undefined && summary.length > 0 && (
          <p className="mt-2 max-w-[68ch] text-body text-pretty text-muted-foreground transition-colors duration-400 ease-exp group-hover:text-foreground">
            {summary}
          </p>
        )}
        {tags !== undefined && tags.length > 0 && <p className="mt-4 font-mono text-label text-muted-foreground/70 uppercase">{tags}</p>}
      </div>
    </HighlightItem>
  )
}

export const PostLedger = ({ children }: Readonly<{ children: ReactNode }>): JSX.Element => (
  <HighlightGroup className="-mx-4 divide-y divide-border border-y border-border md:-mx-6" name="blog-highlight">
    {children}
  </HighlightGroup>
)
