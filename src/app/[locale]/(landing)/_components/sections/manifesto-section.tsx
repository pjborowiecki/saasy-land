import type { JSX } from "react"

import { getTranslations } from "next-intl/server"

import { Reveal } from "~/src/app/[locale]/(landing)/_components/reveal"

/** Each line lands a beat after the one above it. Four lines, three hundred and sixty ms total. */
const LINE_STEP_MS = 120
const SECOND_LINE_DELAY_MS = 240
const THIRD_LINE_DELAY_MS = 360

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
        <div className="max-w-2xl">
          <Reveal variant="quiet">
            <p className="text-statement text-pretty text-muted-foreground">{t("p1")}</p>
          </Reveal>
          <Reveal variant="quiet" delay={LINE_STEP_MS}>
            <p className="mt-4 text-statement text-pretty text-muted-foreground">{t("p2")}</p>
          </Reveal>
          <Reveal variant="quiet" delay={SECOND_LINE_DELAY_MS}>
            <p className="mt-4 text-statement text-pretty text-muted-foreground">{t("p3")}</p>
          </Reveal>
          <Reveal variant="block" delay={THIRD_LINE_DELAY_MS}>
            <p className="mt-10 text-display-gate text-balance text-foreground">{t("p4")}</p>
          </Reveal>
        </div>
      </div>
    </section>
  )
}
