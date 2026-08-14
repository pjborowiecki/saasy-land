import type { JSX, ReactNode } from "react"

import { cn } from "~/src/utils"

const TOP_DEPTH = 2

interface PostTocItemProps {
  readonly children: ReactNode
  readonly depth: number
  readonly href: string
}

/**
 * One heading in the rail.
 *
 * Indented by heading depth rather than flattened, so the shape of the article is visible before
 * it is read. The children carry the title because fumadocs hands back a node, not a string.
 */
export function PostTocItem({ children, depth, href }: PostTocItemProps): JSX.Element {
  return (
    <li>
      <a
        className={cn(
          "block border-l border-border py-1.5 text-body-sm text-pretty text-muted-foreground transition-colors duration-200 ease-exp hover:border-ring hover:text-foreground focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring",
          depth > TOP_DEPTH ? "pl-7" : "pl-4",
        )}
        href={href}
      >
        {children}
      </a>
    </li>
  )
}

interface PostTocProps {
  readonly children: ReactNode
  readonly label: string
}

/**
 * THE CONTENTS RAIL — what the empty half of the page is for.
 *
 * Long-form prose has to sit at a readable measure, which on a wide screen leaves a column of
 * nothing beside it. The first version filled that nothing with nothing, and put the contents in a
 * collapsed accordion above the article — a control the reader has to operate before it tells them
 * anything, placed where they have not yet decided whether to care.
 *
 * A sticky rail answers both: the measure stays at 68ch, the empty column earns its keep, and the
 * outline stays visible while the reader moves through the piece. It is the same arrangement the
 * docs use, which is the point — one site, one way of reading.
 */
export function PostToc({ children, label }: PostTocProps): JSX.Element {
  return (
    <aside className="hidden lg:block">
      <div className="sticky top-24">
        <p className="font-mono text-label text-muted-foreground uppercase">{label}</p>
        <ul className="mt-4">{children}</ul>
      </div>
    </aside>
  )
}
