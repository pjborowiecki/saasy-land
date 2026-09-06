import type { JSX } from "react"

import { useTranslations } from "use-intl/react"

import { cn } from "~/src/lib/cn"

/**
 * Wordmarks, not logo lookalikes. Standing a generic stroke icon in for a brand mark (a box for
 * Next.js, a droplet for Tailwind) is the loudest tell on a landing page: it claims a logo wall
 * and delivers clip art. Names set in the page's own face carry the same signage weight and have
 * the advantage of being true.
 *
 * The roster is the one the copy makes claims about. Bun, Better Auth, Vitest, Playwright,
 * TypeScript and React are named in the hero, the pillars and the FAQ, so leaving them off the
 * strip would have the band contradicting the page it sits in.
 */
const LINE_STACK = [
  "Bun",
  "TanStack Start",
  "React",
  "TypeScript",
  "Cloudflare",
  "Drizzle",
  "D1",
  "Better Auth",
  "Zod",
  "Polar",
  "Resend",
  "Tailwind CSS",
  "shadcn/ui",
  "Vitest",
  "Playwright",
] as const

/** The marquee keyframe translates exactly -50%, so the roster has to render exactly twice. */
const MARQUEE_DUPLICATES = ["first", "second"] as const

/**
 * Fifteen names all set at one weight is a fifteen-word paragraph, not a strip of signage. Every
 * third one drops back so the band reads as a beat: two forward, one back, repeating. The roster
 * length is a multiple of the interval, so the pattern survives the seam where the duplicate
 * half begins.
 */
const RECESSED_INTERVAL = 3

/** The last name in each group of three is the one that drops back. */
const RECESSED_POSITION = 2

/**
 * The stack strip: a static label welded to a moving roster.
 *
 * This is the page's only marquee, and it earns the motion because the content is a list nobody
 * needs to read in full: the visitor is scanning for the one name they care about. The track
 * stops under a pointer or a focused descendant so that scan does not become a timing exercise,
 * and it never starts at all under reduced motion.
 */
export const StackSection = (): JSX.Element => {
  const t = useTranslations("pages.landing.stack")

  return (
    <section aria-label={t("title")} className="relative border-t border-border">
      <div className="mx-auto flex w-full max-w-7xl items-stretch overflow-hidden">
        <p className="hidden shrink-0 items-center border-r border-border px-6 font-mono text-label text-muted-foreground uppercase md:flex md:px-8">
          {t("title")}
        </p>

        {/* `overflow-hidden` here, not only on the row: the track is `w-max` and translates
            left, so without a clip on this box it slides out over the static label. */}
        <div className="relative min-w-0 flex-1 overflow-hidden py-5">
          <div className="flex w-max animate-marquee items-center focus-within:paused hover:paused motion-reduce:paused">
            {MARQUEE_DUPLICATES.map((set) => (
              <div key={set} aria-hidden={set === "second" || undefined} className="flex items-center">
                {LINE_STACK.map((name, index) => (
                  <span
                    key={`${set}-${name}`}
                    className={cn(
                      "px-5 text-body-sm font-medium whitespace-nowrap md:px-7",
                      index % RECESSED_INTERVAL === RECESSED_POSITION ? "text-muted-foreground/60" : "text-muted-foreground",
                    )}
                  >
                    {name}
                  </span>
                ))}
              </div>
            ))}
          </div>

          {/* Scrims, painted after the track so they sit over it without claiming a z-index. */}
          <div
            aria-hidden
            className="pointer-events-none absolute inset-y-0 left-0 w-16 bg-linear-to-r from-background to-transparent md:w-24"
          />
          <div
            aria-hidden
            className="pointer-events-none absolute inset-y-0 right-0 w-16 bg-linear-to-l from-background to-transparent md:w-24"
          />
        </div>
      </div>
    </section>
  )
}
