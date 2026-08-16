import type { JSX } from "react"

import { ArrowRight } from "lucide-react"
import { getFormatter, getTranslations } from "next-intl/server"

import { type BlogPost, blogSource } from "~/src/integrations/fumadocs/fumadocs.source"
import { Link } from "~/src/integrations/next-intl/i18n.navigation"
import { getRootLocale } from "~/src/integrations/next-intl/i18n.root-params"

import { isPublished, readingTimeMinutes, sortPostsByDateDesc, summaryFromFrontmatter } from "~/src/app/[locale]/(blog)/_lib/posts"
import { HighlightGroup, HighlightItem } from "~/src/app/[locale]/(landing)/_components/shared/hover-highlight"
import { Reveal } from "~/src/app/[locale]/(landing)/_components/shared/reveal"
import { ROUTES } from "~/src/routes"

const CARD_COUNT = 3
const GRID_DELAY_MS = 100

/** One post, as a card. Its own component so the grid's nesting does not stack on the section's. */
async function NoteCard({ post }: Readonly<{ post: BlogPost }>): Promise<JSX.Element> {
  const [format, t] = await Promise.all([getFormatter(), getTranslations("pages.blog")])

  const { data, url } = post
  const date = format.dateTime(new Date(data.date), { day: "numeric", month: "short", year: "numeric" })
  const minutes = readingTimeMinutes(data.structuredData)
  const summary = summaryFromFrontmatter(data)

  return (
    <HighlightItem className="group bg-background" contentClassName="flex h-full flex-col px-6 py-8 md:px-8 md:py-10" id={url}>
      <p className="font-mono text-label text-muted-foreground uppercase tabular-nums">
        {date}
        {minutes !== undefined && ` · ${t("post.readingTime", { minutes })}`}
      </p>
      <h3 className="mt-4 text-title text-balance text-foreground">
        <Link
          className="after:absolute after:inset-0 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-ring"
          href={url}
        >
          {data.title}
        </Link>
      </h3>
      {summary !== undefined && (
        <p className="mt-3 text-body-sm text-pretty text-muted-foreground transition-colors duration-400 ease-exp group-hover:text-foreground">
          {summary}
        </p>
      )}
    </HighlightItem>
  )
}

/**
 * THE ARGUMENTS.
 *
 * Sits between the FAQ and the close, which is the only place it can go. A visitor reading the FAQ
 * is working through the objections that survived the whole page, and the objections that survive
 * longest are the comparative ones: why not the cheaper kit, why not the free CLI, why not the
 * other paid one. Those are exactly the posts linked here, so this is a continuation of the FAQ
 * rather than an exit from the funnel. Any earlier and it would be an exit.
 *
 * `featured: true` in the frontmatter decides what appears, topped up with the newest posts so the
 * band is never short. The homepage is the highest-authority page on the site, so a direct link
 * from here is worth more to a post than the two-hop path through the index, and it is what an
 * agent fetching this domain reads before it answers a question about us.
 */
export async function NotesSection(): Promise<JSX.Element> {
  const [locale, t] = await Promise.all([getRootLocale(), getTranslations("pages.landing.notes")])

  const published = sortPostsByDateDesc(blogSource.getPages(locale).filter((page) => isPublished(page.data)))
  const featured = published.filter((page) => page.data.featured === true)
  const rest = published.filter((page) => page.data.featured !== true)
  const posts = [...featured, ...rest].slice(0, CARD_COUNT)

  return (
    <section className="relative border-t border-border">
      <div className="mx-auto w-full max-w-7xl px-6 py-24 md:px-10 md:py-32">
        <Reveal variant="heading">
          <h2 className="max-w-[18ch] text-headline-peak text-balance text-foreground">{t("title")}</h2>
          <p className="mt-5 max-w-2xl text-lead text-pretty text-muted-foreground">{t("description")}</p>
        </Reveal>

        <Reveal className="mt-14 md:mt-20" delay={GRID_DELAY_MS}>
          <HighlightGroup className="grid gap-px border-y border-border bg-border md:grid-cols-3" name="notes-highlight">
            {posts.map((post) => (
              <NoteCard key={post.url} post={post} />
            ))}
          </HighlightGroup>

          <Link
            className="group mt-10 inline-flex items-center gap-2 rounded-sm text-body-sm font-medium text-foreground transition-colors duration-200 ease-exp hover:text-muted-foreground focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-ring"
            href={ROUTES.BLOG}
          >
            {t("cta")}
            <ArrowRight
              aria-hidden
              className="size-3.5 transition-transform duration-200 ease-exp group-hover:translate-x-0.5 motion-reduce:transition-none"
              strokeWidth={2}
            />
          </Link>
        </Reveal>
      </div>
    </section>
  )
}
