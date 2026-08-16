import type { JSX } from "react"

import { ArrowRight } from "lucide-react"
import { getTranslations } from "next-intl/server"

import { Accent } from "~/src/app/[locale]/(landing)/_components/shared/accent"
import { Reveal } from "~/src/app/[locale]/(landing)/_components/shared/reveal"
import { ROUTES } from "~/src/routes"

/** Each line lands a beat after the one above it. Four lines, three hundred and sixty ms total. */
const LINE_STEP_MS = 120
const SECOND_LINE_DELAY_MS = 240

/**
 * The argument, in four sentences and nothing else.
 *
 * No heading, no lead, no illustration, no card. This is the one place on the page where the
 * layout's job is to get out of the way, so the section is a single measure of type on the
 * ground with the first three lines recessed and the conclusion in full strength. The stagger is
 * the only thing doing work: the lines arrive in the order you would say them.
 */
export async function ManifestoSection(): Promise<JSX.Element> {
  const t = await getTranslations("pages.landing.manifesto")

  return (
    <section className="relative border-t border-border" id="manifesto">
      <div className="mx-auto w-full max-w-7xl px-6 py-24 md:px-10 md:py-28">
        <Reveal variant="quiet">
          <p className="max-w-[24ch] text-headline-peak text-balance text-foreground">{t("p1")}</p>
        </Reveal>
        <Reveal variant="quiet" delay={LINE_STEP_MS}>
          <p className="mt-8 max-w-[43.5rem] text-statement text-pretty text-muted-foreground">{t("p2")}</p>
        </Reveal>
        <Reveal variant="block" delay={SECOND_LINE_DELAY_MS}>
          <div className="mt-12 flex">
            <a
              className="group inline-flex items-center gap-4 text-display-gate text-foreground focus-visible:outline-2 focus-visible:outline-offset-6 focus-visible:outline-ring"
              href={ROUTES.HOME_PRICING_SECTION}
            >
              <Accent id="manifesto">{t("p3")}</Accent>
              <ArrowRight
                aria-hidden
                className="size-[0.62em] shrink-0 text-ring transition-transform duration-200 ease-exp group-hover:translate-x-1.5 motion-reduce:transition-none"
                strokeWidth={2.5}
              />
            </a>
          </div>
        </Reveal>
      </div>
    </section>
  )
}
