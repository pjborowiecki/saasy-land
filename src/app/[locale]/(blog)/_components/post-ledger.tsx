import type { JSX, ReactNode } from "react"

import { Link } from "~/src/integrations/next-intl/i18n.navigation"

import { HighlightGroup, HighlightItem } from "~/src/app/[locale]/(landing)/_components/hover-highlight"

interface PostRowProps {
  readonly date: string
  readonly summary?: string | undefined
  /** Pre-joined, not an array: an array in a JSX prop is a new value every render. */
  readonly tags?: string | undefined
  readonly title: string
  readonly url: string
}

/**
 * One post, as a line in a ledger.
 *
 * The whole row is the target, via a link stretched across it rather than an anchor wrapped around
 * the markup: a heading nested inside a link is announced as one long link, and a row of separate
 * links makes the visitor aim. The heading stays a heading; the stretched anchor carries the name.
 */
export function PostRow({ date, summary, tags, title, url }: PostRowProps): JSX.Element {
  return (
    <HighlightItem
      className="group"
      contentClassName="grid gap-x-10 gap-y-2 px-4 py-7 md:grid-cols-[10rem_1fr] md:items-baseline md:px-6 md:py-8"
      id={url}
    >
      <p className="font-mono text-spec text-muted-foreground tabular-nums">{date}</p>
      <div className="min-w-0">
        <h2 className="text-title text-balance text-foreground">
          {/*
           * The whole row is one target through the link's own ::after, stretched over the nearest
           * positioned ancestor — the row box. The anchor wraps the real title text, so the link has
           * content for assistive tech, search and reader mode; nothing on this row is an empty
           * element whose only job is geometry.
           */}
          <Link
            className="after:absolute after:inset-0 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-ring"
            href={url}
          >
            {title}
          </Link>
        </h2>
        {summary === undefined ? undefined : (
          <p className="mt-2 max-w-[68ch] text-body text-pretty text-muted-foreground transition-colors duration-400 ease-exp group-hover:text-foreground">
            {summary}
          </p>
        )}
        {tags === undefined ? undefined : <p className="mt-4 font-mono text-label text-muted-foreground/70 uppercase">{tags}</p>}
      </div>
    </HighlightItem>
  )
}

/**
 * THE INDEX — a ledger, not a grid of cards.
 *
 * Three same-sized cards holding a heading and two lines of grey text is the shape every starter
 * blog ships, and the craft floor names it outright: cards are the lazy container. A hairline
 * ledger has no box to repeat, so the only rhythm left is the one the writing sets, and the dates
 * line up in a column you can scan.
 *
 * It reuses the page's shared hover ground, so moving down the list is one mark travelling rather
 * than three boxes lighting independently.
 */
export function PostLedger({ children }: Readonly<{ children: ReactNode }>): JSX.Element {
  return (
    <HighlightGroup className="-mx-4 divide-y divide-border border-y border-border md:-mx-6" name="blog-highlight">
      {children}
    </HighlightGroup>
  )
}
