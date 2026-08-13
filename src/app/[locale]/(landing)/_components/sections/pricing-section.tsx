import type { JSX } from "react"

import { Check } from "lucide-react"
import { getTranslations } from "next-intl/server"

import { cn } from "~/src/utils"

import { HighlightGroup, HighlightItem } from "~/src/app/[locale]/(landing)/_components/hover-highlight"
import { Reveal } from "~/src/app/[locale]/(landing)/_components/reveal"
import { ROUTES } from "~/src/routes"

const TIERS = ["codebase", "masterclass", "agency"] as const

const FEATURE_IDS = ["f1", "f2", "f3", "f4", "f5"] as const

const FEATURED_TIER = "masterclass"

const GRID_DELAY_MS = 100

interface Tier {
  readonly cta: string
  readonly features: readonly { id: string; label: string }[]
  readonly href: string
  readonly id: string
  readonly isFeatured: boolean
  readonly name: string
  readonly period: string
  readonly price: string
  readonly tagline: string
  readonly whoFor: string
}

function TierFeature({ label }: Readonly<{ label: string }>): JSX.Element {
  return (
    <li className="flex items-start gap-3">
      <Check aria-hidden className="mt-0.5 size-3.5 shrink-0 text-ring" strokeWidth={2.25} />
      <span className="text-body-sm text-pretty text-muted-foreground">{label}</span>
    </li>
  )
}

/** The marker band. Present on every column so the three heads stay on one line. */
function TierBand({ isFeatured, mostPopular }: Readonly<{ isFeatured: boolean; mostPopular: string }>): JSX.Element {
  return (
    <div className="flex h-9 items-center border-b border-border px-7 md:px-8">
      {isFeatured ? (
        <span className="inline-flex items-center gap-2 font-mono text-label text-foreground uppercase">
          <span aria-hidden className="size-1.25 rounded-xs bg-ring" />
          {mostPopular}
        </span>
      ) : undefined}
    </div>
  )
}

function TierColumn({ mostPopular, tier }: Readonly<{ mostPopular: string; tier: Tier }>): JSX.Element {
  return (
    <HighlightItem
      className={cn(
        "border-border not-last:border-b md:not-last:border-r md:not-last:border-b-0",
        tier.isFeatured ? "bg-card" : "bg-background",
      )}
      contentClassName="flex h-full flex-col"
      id={tier.id}
    >
      <TierBand isFeatured={tier.isFeatured} mostPopular={mostPopular} />

      <div className="flex flex-1 flex-col p-7 md:p-8">
        <h3 className="text-title text-foreground">{tier.name}</h3>
        <p className="mt-1.5 text-body-sm text-pretty text-muted-foreground md:min-h-12">{tier.whoFor}</p>

        <p className="mt-7 flex items-baseline gap-2">
          <span className="text-price text-foreground tabular-nums">{tier.price}</span>
          <span className="font-mono text-spec text-muted-foreground">{tier.period}</span>
        </p>
        <p className="mt-3 text-body-sm text-pretty text-muted-foreground md:min-h-12">{tier.tagline}</p>

        <ul className="mt-7 space-y-3 border-t border-border pt-7">
          {tier.features.map((feature) => (
            <TierFeature key={feature.id} label={feature.label} />
          ))}
        </ul>

        {/* The CTA is pinned to the foot of the column by a spacer, so the three buttons form
            one horizontal line whatever the feature copy does above. */}
        <div className="mt-auto pt-10 md:pt-12">
          <a
            className={cn(
              "inline-flex h-11 w-full items-center justify-center rounded-lg px-5 text-body-sm font-semibold transition-[background-color,border-color,transform] duration-200 ease-exp focus-visible:outline-2 focus-visible:outline-offset-3 focus-visible:outline-ring active:translate-y-px",
              tier.isFeatured
                ? "bg-primary text-primary-foreground hover:bg-primary/88"
                : "border border-border text-foreground hover:bg-muted",
            )}
            href={tier.href}
          >
            {tier.cta}
          </a>
        </div>
      </div>
    </HighlightItem>
  )
}

/**
 * One frame, three tiers, hairlines between them.
 *
 * Not three floating cards. Three cards means three shadows, three borders and three chances for
 * the middle one to be scaled up and rotated into a "recommended" pose; one frame divided by
 * rules says the tiers are three readings of the same offer, which is what they are.
 *
 * The featured tier is marked by fill and a chip. It is not taller, not scaled and not glowing.
 *
 * EVERY ROW STARTS ON THE SAME LINE. `whoFor`, `tagline` and the price sit in min-height blocks
 * so the three feature lists begin at one Y position and the three CTAs end at another, whatever
 * the copy does in a given locale. Ragged baselines across priced columns is the fastest way to
 * make a pricing table look unfinished.
 */
export async function PricingSection(): Promise<JSX.Element> {
  const t = await getTranslations("pages.landing.pricing")

  const tiers: readonly Tier[] = TIERS.map((tier) => ({
    cta: t(`tiers.${tier}.cta`),
    features: FEATURE_IDS.map((feature) => ({ id: feature, label: t(`tiers.${tier}.features.${feature}`) })),
    href: `${ROUTES.SIGN_UP}?tier=${tier}`,
    id: tier,
    isFeatured: tier === FEATURED_TIER,
    name: t(`tiers.${tier}.name`),
    period: t(`tiers.${tier}.period`),
    price: t(`tiers.${tier}.price`),
    tagline: t(`tiers.${tier}.tagline`),
    whoFor: t(`tiers.${tier}.whoFor`),
  }))

  return (
    <section className="relative border-t border-border" id="pricing">
      <div className="mx-auto w-full max-w-7xl px-6 py-24 md:px-10 md:py-32">
        <Reveal variant="heading">
          <div className="grid gap-x-16 gap-y-5 md:grid-cols-[1.1fr_1fr] md:items-end">
            <h2 className="max-w-[12ch] text-headline-peak text-balance text-foreground">{t("title")}</h2>
            <div>
              <p className="text-lead text-pretty text-muted-foreground">{t("description")}</p>
              <p className="mt-3 font-mono text-spec text-muted-foreground">{t("note")}</p>
            </div>
          </div>
        </Reveal>

        <Reveal className="mt-14 md:mt-20" delay={GRID_DELAY_MS}>
          <HighlightGroup className="grid overflow-hidden rounded-xl border border-border md:grid-cols-3" name="pricing-highlight">
            {tiers.map((tier) => (
              <TierColumn key={tier.id} mostPopular={t("mostPopular")} tier={tier} />
            ))}
          </HighlightGroup>

          <p className="mt-8 flex max-w-3xl items-start gap-3">
            <Check aria-hidden className="mt-0.5 size-3.5 shrink-0 text-ring" strokeWidth={2.25} />
            <span className="text-body-sm text-pretty text-muted-foreground">{t("assurance")}</span>
          </p>
        </Reveal>

        {/*
         * The ledger closes the section rather than opening it: the price is the objection, so
         * the arithmetic that answers it belongs after the number, not before it. This is the
         * page's single use of `text-display-blast`.
         */}
        <Reveal className="mt-20 border-t border-border pt-14 md:mt-28 md:pt-16" delay={GRID_DELAY_MS}>
          <div className="grid gap-x-16 gap-y-6 md:grid-cols-[1fr_1fr] md:items-start">
            <p className="text-display-blast text-balance text-foreground">{t("ledger.lead")}</p>
            <p className="text-body text-pretty text-muted-foreground">{t("ledger.body")}</p>
          </div>
        </Reveal>
      </div>
    </section>
  )
}
