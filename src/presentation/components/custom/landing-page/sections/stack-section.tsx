import type { JSX } from "react"

import { useTranslations } from "use-intl/react"

import { cn } from "~/src/lib/cn"

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

/** Duplicate the roster for the -50% marquee loop. */
const MARQUEE_DUPLICATES = ["first", "second"] as const

const RECESSED_INTERVAL = 3

const RECESSED_POSITION = 2

export const StackSection = (): JSX.Element => {
  const t = useTranslations("pages.landing.stack")

  return (
    <section aria-label={t("title")} className="relative border-t border-border">
      <div className="mx-auto flex w-full max-w-7xl items-stretch overflow-hidden">
        <p className="hidden shrink-0 items-center border-r border-border px-6 font-mono text-label text-muted-foreground uppercase md:flex md:px-8">
          {t("title")}
        </p>

        {/* Clip the moving track before it reaches the static label. */}
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
