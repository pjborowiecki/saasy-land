import type { JSX, ReactNode } from "react"

import { cn } from "~/src/utils"

const TOP_DEPTH = 2

interface PostTocItemProps {
  readonly children: ReactNode
  readonly depth: number
  readonly href: string
}

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
