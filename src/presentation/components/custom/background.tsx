import type { JSX } from "react"

import { cn } from "~/src/utils"

/*
 * `var(--border)`, never `var(--color-border)`. `@theme inline` declares
 * `--color-border: var(--border)` on `:root`, and a custom property referencing another
 * resolves at the element it is declared on, so `--color-border` computes once against the
 * light palette and every `.dark` descendant inherits that resolved value: the grid would
 * draw near-black lines on a near-black ground and vanish in dark mode.
 */
export const backgroundGridPatternClassName =
  "bg-[linear-gradient(to_right,var(--border)_1px,transparent_1px),linear-gradient(to_bottom,var(--border)_1px,transparent_1px)] bg-size-[56px_56px]"

/**
 * The app's ambient layer: a measured grid that fades out before it reaches the content, and
 * an optional wash of the accent behind the top of the page.
 *
 * Both layers are `fixed` and `pointer-events-none`, so neither ever repaints on scroll. The
 * wash is `--ring`, the palette's only chromatic token, at an alpha low enough to read as depth
 * rather than as a colour: the same "signal" the landing uses, so the two surfaces feel lit by
 * the same source.
 */
export function Background({
  className,
  glow = true,
}: Readonly<{
  className?: string
  glow?: boolean
}>): JSX.Element {
  return (
    <>
      <div
        aria-hidden
        className={cn("field-taper pointer-events-none fixed inset-0 opacity-70", backgroundGridPatternClassName, className)}
      />
      {glow ? <div aria-hidden className={cn("field-signal pointer-events-none fixed inset-0", className)} /> : undefined}
    </>
  )
}
