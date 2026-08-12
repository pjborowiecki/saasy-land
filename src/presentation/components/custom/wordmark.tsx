import type { JSX } from "react"

import { cn } from "~/src/utils"

import { APP_NAME } from "~/src/presentation/branding"

/**
 * A rounded square with its top-right corner cut away: a file corner, a folder tab, a
 * repository. It is the only figurative thing in the product, and the only hand-drawn SVG.
 *
 * One path, `currentColor`, no strokes. Drawing the notch as an overlaid box painted in the
 * surface colour was simpler but wrong: the mark then only composites correctly on the page
 * ground, and it sits on the sidebar, on cards and on the footer, each a different fill. A cut
 * in the path itself is transparent, so it is correct on every surface there will ever be.
 */
export function WordmarkGlyph({ className }: Readonly<{ className?: string }>): JSX.Element {
  return (
    <svg aria-hidden className={cn("size-5.5 shrink-0", className)} fill="currentColor" viewBox="0 0 24 24">
      <path d="M6 0H15V9H24V18A6 6 0 0 1 18 24H6A6 6 0 0 1 0 18V6A6 6 0 0 1 6 0Z" />
    </svg>
  )
}

interface WordmarkProps {
  readonly className?: string
  /** Mark only, for collapsed rails and tight chrome. */
  readonly glyphOnly?: boolean
}

export function Wordmark({ className, glyphOnly = false }: WordmarkProps): JSX.Element {
  return (
    <span className={cn("flex items-center gap-2.5 text-foreground", className)}>
      <WordmarkGlyph />
      {glyphOnly ? undefined : <span className="text-[0.9375rem] font-semibold tracking-[-0.02em]">{APP_NAME}</span>}
    </span>
  )
}
