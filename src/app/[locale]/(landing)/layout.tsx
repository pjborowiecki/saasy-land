import type { JSX } from "react"

import { Footer } from "~/src/app/[locale]/(landing)/_components/footer"
import { MotionProvider } from "~/src/app/[locale]/(landing)/_components/motion-provider"
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
 * MOTION: reactive, not decorative. One entrance (`Reveal`), one hero timeline, one marquee,
 * and beyond that the page moves only because somebody moved it. Motion for React is loaded
 * lazily, after first paint, and is spent on state the visitor changes — the run panel reflowing
 * when a capability is switched off, a count travelling rather than cutting. Still no pins, no
 * scrubbing, no parallax: scroll-driven spectacle is the house style of every template this page
 * exists to not resemble. If the scrollbar is the only thing that can trigger it, it does not
 * ship. Everything obeys `prefers-reduced-motion` through `MotionConfig`.
 *
 * COMMITTED DARK: the route group renders inside `.dark` and never switches. The light `:root`
 * ramp belongs to the app, the admin and the docs.
 */
export default function LandingPageLayout({ children }: Readonly<LayoutProps<"/[locale]">>): JSX.Element {
  return (
    <div className="dark relative isolate min-h-svh bg-background text-foreground">
      <PageFrame />
      <MotionProvider>
        <Navigation />
        <main className="relative z-10">{children}</main>
        <Footer />
      </MotionProvider>
    </div>
  )
}
