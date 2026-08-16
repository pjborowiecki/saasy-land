import type { JSX, ReactNode } from "react"

import { getFormatter, getTranslations } from "next-intl/server"

import type { BlogPost } from "~/src/integrations/fumadocs/fumadocs.source"
import { Link } from "~/src/integrations/next-intl/i18n.navigation"

import { readingTimeMinutes, summaryFromFrontmatter } from "~/src/app/[locale]/(blog)/_lib/posts"
import { HighlightGroup, HighlightItem } from "~/src/app/[locale]/(landing)/_components/shared/hover-highlight"

interface PostRowProps {
  readonly post: BlogPost
}

export async function PostRow({ post }: PostRowProps): Promise<JSX.Element> {
  const [t, format] = await Promise.all([getTranslations("pages.blog"), getFormatter()])

  const { data, url } = post
  const { title } = data

  const tags = data.tags?.length ? data.tags.join(" · ") : undefined

  const date = format.dateTime(new Date(data.date), { day: "numeric", month: "short", year: "numeric" })
  const minutes = readingTimeMinutes(data.structuredData)
  const summary = summaryFromFrontmatter(data)

  return (
    <HighlightItem
      className="group"
      contentClassName="grid gap-x-10 gap-y-2 px-4 py-7 md:grid-cols-[10rem_1fr] md:items-baseline md:px-6 md:py-8"
      id={url}
    >
      <div className="font-mono text-spec text-muted-foreground tabular-nums">
        <p>{date}</p>
        {minutes && <p className="mt-1 text-muted-foreground/60">{t("post.readingTime", { minutes })}</p>}
      </div>
      <div className="min-w-0">
        <h2 className="text-title text-balance text-foreground">
          <Link
            className="after:absolute after:inset-0 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-ring"
            href={url}
          >
            {title}
          </Link>
        </h2>
        {summary && (
          <p className="mt-2 max-w-[68ch] text-body text-pretty text-muted-foreground transition-colors duration-400 ease-exp group-hover:text-foreground">
            {summary}
          </p>
        )}
        {tags && <p className="mt-4 font-mono text-label text-muted-foreground/70 uppercase">{tags}</p>}
      </div>
    </HighlightItem>
  )
}

export function PostLedger({ children }: Readonly<{ children: ReactNode }>): JSX.Element {
  return (
    <HighlightGroup className="-mx-4 divide-y divide-border border-y border-border md:-mx-6" name="blog-highlight">
      {children}
    </HighlightGroup>
  )
}
