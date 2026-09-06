import type { JSX } from "react"

import { Link } from "@tanstack/react-router"
import { ArrowRight } from "lucide-react"
import { useTranslations } from "use-intl/react"

import { Reveal } from "~/src/presentation/components/custom/landing-page/components/reveal"

import { ROUTES } from "~/src/routes"

const DETAIL_DELAY_MS = 100
const TERMS_DELAY_MS = 200

const BADGES = ["projects", "license", "fees"] as const

/**
 * The close.
 *
 * The field and the signal come back, and this is the only other place on the page they appear:
 * the ambient marks the two moments where the page is asking rather than explaining, so the
 * closing screen answers the opening one. Everything between them is on the bare ground.
 *
 * Centred, and deliberately: the whole page is left-aligned to a visible measure, so the one
 * section that abandons the measure is the one that reads as an ending.
 */
export const GateSection = (): JSX.Element => {
  const t = useTranslations("pages.landing.gate")

  return (
    <section className="relative overflow-hidden border-t border-border" id="gate">
      <div aria-hidden className="field-grid pointer-events-none absolute inset-0" />
      <div aria-hidden className="field-signal field-taper pointer-events-none absolute inset-0" />

      <div className="relative mx-auto flex w-full max-w-3xl flex-col items-center px-6 py-28 text-center md:py-36">
        <Reveal variant="heading">
          <h2 className="text-display-gate text-balance text-foreground">{t("title")}</h2>
          <p className="mx-auto mt-6 max-w-xl text-lead text-pretty text-muted-foreground">{t("description")}</p>
        </Reveal>

        <Reveal className="mt-10 flex flex-wrap items-center justify-center gap-x-3 gap-y-4" delay={DETAIL_DELAY_MS}>
          <a
            className="inline-flex h-11 items-center rounded-lg bg-primary px-5 text-body-sm font-semibold text-primary-foreground transition-[background-color,transform] duration-200 ease-exp hover:bg-primary/88 focus-visible:outline-2 focus-visible:outline-offset-3 focus-visible:outline-ring active:translate-y-px"
            href={ROUTES.HOME_PRICING_SECTION}
          >
            {t("ctaPrimary")}
          </a>
          <Link
            className="group inline-flex h-11 items-center gap-1.5 rounded-lg border border-border bg-card/60 px-5 text-body-sm font-medium text-foreground transition-[background-color,border-color,transform] duration-200 ease-exp hover:bg-muted focus-visible:outline-2 focus-visible:outline-offset-3 focus-visible:outline-ring active:translate-y-px"
            to={ROUTES.DOCS}
          >
            {t("ctaSecondary")}
            <ArrowRight
              aria-hidden
              className="size-3.5 text-muted-foreground transition-transform duration-200 ease-exp group-hover:translate-x-0.5 motion-reduce:transition-none"
              strokeWidth={2}
            />
          </Link>
        </Reveal>

        <Reveal className="mt-12 w-full" delay={TERMS_DELAY_MS} variant="quiet">
          <p className="flex items-baseline justify-center gap-2.5">
            <span className="text-price text-foreground tabular-nums">{t("price")}</span>
            <span className="font-mono text-spec text-muted-foreground">{t("terms")}</span>
          </p>
          {/* The three terms a buyer at this price is actually asking about, and the two the line
              above has no room for. Dots rather than a list, because three short nouns stacked
              read as a feature table and this is a receipt. */}
          <ul className="mt-4 flex flex-wrap items-center justify-center gap-x-2.5 gap-y-1.5 font-mono text-label text-muted-foreground/70 uppercase">
            {BADGES.map((badge) => (
              <li
                className="flex items-center gap-2.5 before:text-muted-foreground/30 before:content-['·'] first:before:hidden"
                key={badge}
              >
                {t(`badges.${badge}`)}
              </li>
            ))}
          </ul>
          <p className="mx-auto mt-5 max-w-lg text-body-sm text-pretty text-muted-foreground">{t("assurance")}</p>
        </Reveal>
      </div>
    </section>
  )
}
