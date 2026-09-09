import type { JSX } from "react"

import { Check } from "lucide-react"
import { useTranslations } from "use-intl/react"

import { FEATURED_TIER, FEATURE_IDS, TIERS, TIER_PRICES } from "~/src/data/marketing-pricing"

import { ConsultingBand } from "~/src/presentation/components/custom/landing-page/components/consulting-band"
import { HighlightGroup } from "~/src/presentation/components/custom/landing-page/components/hover-highlight"
import { ParityNote } from "~/src/presentation/components/custom/landing-page/components/parity-note"
import { Price } from "~/src/presentation/components/custom/landing-page/components/price"
import { Reveal } from "~/src/presentation/components/custom/landing-page/components/reveal"
import { type Tier, TierColumn } from "~/src/presentation/components/custom/landing-page/components/tier-column"

const GRID_DELAY_MS = 100

export const PricingSection = (): JSX.Element => {
  const t = useTranslations("pages.landing.pricing")

  const tiers: readonly Tier[] = TIERS.map((tier) => ({
    cta: t(`tiers.${tier}.cta`),
    features: FEATURE_IDS.map((feature) => ({ id: feature, label: t(`tiers.${tier}.features.${feature}`) })),
    id: tier,
    isFeatured: tier === FEATURED_TIER,
    name: t(`tiers.${tier}.name`),
    period: t(`tiers.${tier}.period`),
    price: <Price amount={TIER_PRICES[tier]} />,
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

          <ParityNote />

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
