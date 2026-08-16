import type { JSX } from "react"

import { Check } from "lucide-react"
import { getTranslations } from "next-intl/server"

import { cn } from "~/src/utils"

import { HighlightGroup, HighlightItem } from "~/src/app/[locale]/(landing)/_components/shared/hover-highlight"
import { Reveal } from "~/src/app/[locale]/(landing)/_components/shared/reveal"
import { ROUTES } from "~/src/routes"

const TIERS = ["core", "complete", "agency"] as const

const FEATURE_IDS = ["f1", "f2", "f3", "f4", "f5", "f6"] as const

const FEATURED_TIER = "complete"

const GRID_DELAY_MS = 100

/** Booked by email until the scheduling page exists, so the button is never a dead link. */
const CONSULTING_HREF = "mailto:hello@saasyland.com?subject=Architecture%20call"

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

/**
 * The marker band, present on every column so the three heads start on one line.
 *
 * A rule, not a badge. The page marks things with hairlines and spends the accent on marks a few
 * pixels wide, so a filled chip read as a sticker from another site; the same signal is carried
 * by drawing the featured column's top edge in the accent and setting its label in the same
 * colour. Louder than the muted 11px caption it replaces, quiet enough to belong here.
 */
function TierBand({ isFeatured, mostPopular }: Readonly<{ isFeatured: boolean; mostPopular: string }>): JSX.Element {
  return (
    <div className={cn("flex h-10 items-center border-b border-border px-7 md:px-8", isFeatured && "border-t-2 border-t-ring")}>
      {isFeatured && <span className="font-mono text-spec tracking-[0.1em] text-ring uppercase">{mostPopular}</span>}
    </div>
  )
}

interface ConsultingProps {
  readonly body: string
  readonly cta: string
  readonly label: string
  readonly period: string
  readonly price: string
  readonly title: string
}

/**
 * The hour, sold separately.
 *
 * One wide band rather than the pair of cards the category usually puts here, because there is one
 * offer and inventing a second to fill a two-column grid would be obvious. Under the table rather
 * than inside it: this is not a fourth tier, it is what you can buy when none of the three was
 * what you needed today.
 */
function ConsultingBand({ body, cta, label, period, price, title }: ConsultingProps): JSX.Element {
  return (
    <div className="grid gap-x-12 gap-y-7 rounded-xl border border-border bg-card p-7 md:grid-cols-[1fr_auto] md:items-center md:p-8">
      <div>
        <p className="font-mono text-label text-muted-foreground uppercase">{label}</p>
        <h3 className="mt-3 max-w-[26ch] text-title text-balance text-foreground">{title}</h3>
        <p className="mt-3 max-w-[64ch] text-body-sm text-pretty text-muted-foreground">{body}</p>
      </div>
      {/* The button matches the width of the price above it: a short pill under a large figure
          reads as an afterthought, and this is the only way to buy the hour. */}
      <div className="flex flex-col items-stretch gap-4">
        <p className="flex items-baseline gap-2 md:justify-end">
          <span className="text-price text-foreground tabular-nums">{price}</span>
          <span className="font-mono text-spec text-muted-foreground">{period}</span>
        </p>
        <a
          className="inline-flex h-11 items-center justify-center rounded-lg border border-border px-5 text-body-sm font-semibold whitespace-nowrap text-foreground transition-[background-color,border-color,transform] duration-200 ease-exp hover:bg-muted focus-visible:outline-2 focus-visible:outline-offset-3 focus-visible:outline-ring active:translate-y-px"
          href={CONSULTING_HREF}
        >
          {cta}
        </a>
      </div>
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

        <Reveal className="mt-12 md:mt-14" delay={GRID_DELAY_MS} variant="quiet">
          <ConsultingBand
            body={t("consulting.body")}
            cta={t("consulting.cta")}
            label={t("consulting.label")}
            period={t("consulting.period")}
            price={t("consulting.price")}
            title={t("consulting.title")}
          />
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
