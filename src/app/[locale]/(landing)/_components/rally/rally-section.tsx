import type { JSX } from "react"

import { ArrowRight } from "lucide-react"
import { getTranslations } from "next-intl/server"

import { Reveal } from "~/src/app/[locale]/(landing)/_components/shared/reveal"
import { ROUTES } from "~/src/routes"

const CTA_DELAY_MS = 100

/**
 * THE RALLY.
 *
 * Placed straight after the coverage gate, because that is where conviction peaks: the visitor has
 * just watched the one claim on this page that no competitor makes, and the next five sections are
 * an unbroken run of prose, tables and inventories. A page that argues for that long without once
 * asking for the sale is a whitepaper.
 *
 * It carries the ambient field, which until now marked only the hero and the close. That is the
 * rule rather than an exception to it: the texture marks the moments where the page is asking
 * instead of explaining, and there are now three of them. It stays left-aligned on the measure,
 * because centring is what makes the closing screen read as an ending, and spending that here
 * would cost the close more than it gains this band.
 *
 * Shorter than a full section on purpose. It is a breath between two arguments, not a third one.
 */
export async function RallySection(): Promise<JSX.Element> {
  const t = await getTranslations("pages.landing.rally")

  return (
    <section className="relative overflow-hidden border-t border-border">
      <div aria-hidden className="field-grid pointer-events-none absolute inset-0" />
      <div aria-hidden className="field-signal field-taper pointer-events-none absolute inset-0" />

      <div className="relative mx-auto grid w-full max-w-7xl gap-x-16 gap-y-8 px-6 py-20 md:grid-cols-[1.2fr_auto] md:items-end md:px-10 md:py-24">
        <Reveal variant="heading">
          <h2 className="max-w-[20ch] text-headline-peak text-balance text-foreground">{t("title")}</h2>
          <p className="mt-5 max-w-2xl text-lead text-pretty text-muted-foreground">{t("body")}</p>
        </Reveal>

        <Reveal className="flex flex-wrap items-center gap-x-3 gap-y-4 md:pb-1" delay={CTA_DELAY_MS} variant="quiet">
          <a
            className="inline-flex h-11 items-center rounded-lg bg-primary px-5 text-body-sm font-semibold text-primary-foreground transition-[background-color,transform] duration-200 ease-exp hover:bg-primary/88 focus-visible:outline-2 focus-visible:outline-offset-3 focus-visible:outline-ring active:translate-y-px"
            href={ROUTES.HOME_CLI_SECTION}
          >
            {t("ctaPrimary")}
          </a>
          <a
            className="group inline-flex h-11 items-center gap-1.5 rounded-lg border border-border bg-card/60 px-5 text-body-sm font-medium text-foreground transition-[background-color,border-color,transform] duration-200 ease-exp hover:bg-muted focus-visible:outline-2 focus-visible:outline-offset-3 focus-visible:outline-ring active:translate-y-px"
            href={ROUTES.HOME_PRICING_SECTION}
          >
            {t("ctaSecondary")}
            <ArrowRight
              aria-hidden
              className="size-3.5 text-muted-foreground transition-transform duration-200 ease-exp group-hover:translate-x-0.5 motion-reduce:transition-none"
              strokeWidth={2}
            />
          </a>
        </Reveal>
      </div>
    </section>
  )
}
