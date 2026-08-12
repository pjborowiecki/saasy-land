import type { JSX } from "react"

import { Footer } from "~/src/app/[locale]/(landing)/_components/footer"
import { Navigation } from "~/src/app/[locale]/(landing)/_components/navigation"
import { PageFrame } from "~/src/app/[locale]/(landing)/_components/page-frame"

/*
 * DESIGN DIRECTION CONTRACT — SaaSyLand landing
 *
 * THESIS: the product is a codebase whose entire pitch is that every claim about it is
 * checkable, so the page is built as an instrument rather than as an advertisement. It states
 * measured facts in monospace, shows the real admin rather than a mockup of one, and cites
 * where in the repository each number comes from. Nothing is decorated; everything is stated.
 *
 * OWN-WORLD: one cold near-black ground; a single hue of chroma in the whole palette, carried
 * by `--ring`, and spent only on state (focus, liveness, verification, progress); hairlines as
 * the only structure; Geist across the entire type ramp with size, weight and optical tracking
 * carrying the hierarchy; monospace strictly for real measurements.
 *
 * STRUCTURE: `PageFrame` draws the content measure as two fixed vertical hairlines; every
 * section draws a full-bleed `border-t` across them. Thirteen sections, one drawing.
 *
 * MOTION: subtractive. One entrance (`Reveal`), one hero timeline, one marquee. Everything
 * else is a 200ms state change on a real interaction. No pins, no scrubbing, no parallax.
 *
 * COMMITTED DARK: the route group renders inside `.dark` and never switches. The light `:root`
 * ramp belongs to the app, the admin and the docs.
 */
export default function LandingPageLayout({ children }: Readonly<LayoutProps<"/[locale]">>): JSX.Element {
  return (
    <div className="dark relative isolate min-h-svh bg-background text-foreground">
      <PageFrame />
      <Navigation />
      <main className="relative z-10">{children}</main>
      <Footer />
    </div>
  )
}
