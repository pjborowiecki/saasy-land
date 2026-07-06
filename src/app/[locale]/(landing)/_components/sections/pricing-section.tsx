import type { JSX } from "react"

import { getTranslations } from "next-intl/server"

import { PricingBillingShell } from "~/src/app/[locale]/(landing)/_components/sections/pricing-billing-shell"
import { LifetimePricingCard, ProPricingCard, StarterPricingCard } from "~/src/app/[locale]/(landing)/_components/sections/pricing-cards"

export async function PricingSection(): Promise<JSX.Element> {
  const t = await getTranslations("pages.landing.pricing")

  return (
    <section className="relative z-10 mx-auto max-w-7xl px-6 py-16 md:py-24">
      <div className="mx-auto mb-20 max-w-2xl text-center">
        <h2 className="mb-6 text-4xl font-medium tracking-tight text-foreground md:text-5xl">
          {t("titlePart1")}
          <span className="bg-linear-to-r from-primary to-primary/60 bg-clip-text text-transparent">{t("titlePart2")}</span>
        </h2>
        <p className="text-lg font-normal text-muted-foreground">{t("description")}</p>
      </div>

      <PricingBillingShell monthlyLabel={t("monthly")} save20Label={t("save20")} yearlyLabel={t("yearly")}>
        <div className="relative mx-auto grid max-w-[1100px] grid-cols-1 gap-8 md:grid-cols-3 lg:gap-8">
          <div className="pointer-events-none absolute top-1/2 left-1/2 -z-10 h-[400px] w-full max-w-2xl -translate-x-1/2 -translate-y-1/2 rounded-full bg-primary/15 blur-[120px]" />
          <StarterPricingCard t={t} />
          <ProPricingCard t={t} />
          <LifetimePricingCard t={t} />
        </div>
      </PricingBillingShell>
    </section>
  )
}
