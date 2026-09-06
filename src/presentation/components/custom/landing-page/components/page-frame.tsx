import type { JSX } from "react"

/**
 * THE FRAME — two hairlines at the content measure, running the full height of the viewport.
 *
 * This is the page's one structural idea. Every section draws its own full-bleed `border-t`,
 * and these two verticals cross all of them, so thirteen separately authored sections read as
 * one continuous drawing instead of as thirteen stacked blocks. It also makes the measure
 * visible: the visitor can see what the page is aligned to, which is most of the difference
 * between "laid out" and "composed".
 *
 * `fixed`, so it never scrolls and therefore never repaints. It is one element with a border
 * on two sides; there is no cheaper way to draw a line down a page.
 *
 * `z-20`, above the sections rather than behind them. Any section that paints a background
 * would otherwise cover the rules, so the frame would appear and disappear down the page
 * wherever a full-bleed band happens to be opaque. Above the sections it is continuous, and
 * because every section's content is inset by the container gutter, the rules land on empty
 * margin and never cross a word or a card.
 *
 * Hidden below `lg`. On a phone the container gutter is 24px and the rules would sit almost on
 * the screen edge, where they read as a rendering artefact rather than as a margin.
 */
export const PageFrame = (): JSX.Element => (
  <div aria-hidden className="pointer-events-none fixed inset-0 z-20 hidden justify-center lg:flex">
    <div className="h-full w-full max-w-7xl border-x border-border" />
  </div>
)
