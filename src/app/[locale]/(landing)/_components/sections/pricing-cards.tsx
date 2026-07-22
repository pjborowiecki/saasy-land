import type { JSX } from "react"

import { CheckCircle2, XCircle } from "lucide-react"
import type { getTranslations } from "next-intl/server"

import { Badge } from "~/src/presentation/components/shadcn/badge"
import { Button } from "~/src/presentation/components/shadcn/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "~/src/presentation/components/shadcn/card"

const STARTER_INCLUDED_FEATURES = ["1", "2", "3"] as const
const STARTER_DISABLED_FEATURES = ["4", "5"] as const
const PRO_FEATURES = ["1", "2", "3", "4", "5"] as const
const LIFETIME_FEATURES = ["1", "2", "3", "4", "5"] as const

type PricingTranslator = Awaited<ReturnType<typeof getTranslations<"pages.landing.pricing">>>

function PricingPrice({ monthly, period, yearly }: { monthly: string; period: string; yearly: string }): JSX.Element {
  return (
    <div className="flex items-baseline gap-2">
      <span className="text-5xl font-medium tracking-tight text-foreground group-data-[billing=yearly]/pricing:hidden">{monthly}</span>
      <span className="hidden text-5xl font-medium tracking-tight text-foreground group-data-[billing=yearly]/pricing:inline">
        {yearly}
      </span>
      <span className="text-sm text-muted-foreground">{period}</span>
    </div>
  )
}

function PricingFeature({
  icon: Icon,
  iconClassName,
  label,
  muted,
}: {
  icon: typeof CheckCircle2
  iconClassName: string
  label: string
  muted?: boolean
}): JSX.Element {
  return (
    <li className={`flex items-center gap-3 text-sm ${muted === true ? "text-muted-foreground" : "text-foreground"}`}>
      <Icon className={iconClassName} />
      <span>{label}</span>
    </li>
  )
}

function StarterPricingCard({ t }: { t: PricingTranslator }): JSX.Element {
  return (
    <Card className="group relative flex flex-col overflow-visible border-border/50 bg-background/80 backdrop-blur-md transition-all duration-300 hover:-translate-y-1 hover:border-border hover:bg-muted/80 hover:shadow-2xl hover:shadow-primary/10">
      <div className="pointer-events-none absolute inset-0 z-0 overflow-hidden rounded-lg">
        <div className="absolute inset-0 bg-linear-to-br from-primary/5 via-transparent to-transparent opacity-0 transition-opacity duration-500 group-hover:opacity-100" />
      </div>
      <CardHeader className="relative z-10 flex flex-col items-start pt-8">
        <CardTitle className="text-xl font-medium tracking-tight text-foreground">{t("starter.title")}</CardTitle>
        <CardDescription className="mb-4">{t("starter.description")}</CardDescription>
        <PricingPrice monthly={t("starter.priceMonthly")} period={t("starter.period")} yearly={t("starter.priceYearly")} />
      </CardHeader>
      <CardContent className="relative z-10 flex flex-1 flex-col pb-8">
        <Button variant="outline" size="lg" className="mb-8 h-12 w-full bg-background/50 text-base">
          {t("starter.button")}
        </Button>
        <ul className="flex flex-1 flex-col space-y-4">
          {STARTER_INCLUDED_FEATURES.map((i) => (
            <PricingFeature
              key={`starter-included-${i}`}
              icon={CheckCircle2}
              iconClassName="size-5 shrink-0 text-primary"
              label={t(`starter.features.f${i}`)}
            />
          ))}
          {STARTER_DISABLED_FEATURES.map((i) => (
            <PricingFeature
              key={`starter-disabled-${i}`}
              icon={XCircle}
              iconClassName="size-5 shrink-0"
              label={t(`starter.features.f${i}`)}
              muted
            />
          ))}
        </ul>
      </CardContent>
    </Card>
  )
}

function ProPricingCard({ t }: { t: PricingTranslator }): JSX.Element {
  return (
    <Card className="group relative flex flex-col overflow-visible border-primary/20 bg-background/80 shadow-[0_0_40px_rgba(217,70,239,0.05)] backdrop-blur-md transition-all duration-300 hover:-translate-y-1 hover:border-primary/40 hover:bg-muted/80 hover:shadow-2xl hover:shadow-primary/20">
      <div className="pointer-events-none absolute inset-0 z-0 overflow-hidden rounded-lg">
        <div className="absolute inset-0 bg-linear-to-br from-primary/10 via-transparent to-transparent opacity-0 transition-opacity duration-500 group-hover:opacity-100" />
      </div>
      <Badge className="absolute -top-3 left-1/2 z-20 -translate-x-1/2 bg-linear-to-r from-primary to-primary/60 px-4 py-1 text-xs whitespace-nowrap shadow-lg">
        {t("pro.badge")}
      </Badge>
      <CardHeader className="relative z-10 flex flex-col items-start pt-8">
        <CardTitle className="text-xl font-medium tracking-tight text-foreground">{t("pro.title")}</CardTitle>
        <CardDescription className="mb-4">{t("pro.description")}</CardDescription>
        <PricingPrice monthly={t("pro.priceMonthly")} period={t("pro.period")} yearly={t("pro.priceYearly")} />
      </CardHeader>
      <CardContent className="relative z-10 flex flex-1 flex-col pb-8">
        <Button
          size="lg"
          className="mb-8 h-12 w-full bg-linear-to-b from-primary to-primary/80 text-base text-primary-foreground shadow-[0_0_15px_-3px_var(--color-primary)] transition-all hover:opacity-90"
        >
          {t("pro.button")}
        </Button>
        <ul className="flex flex-1 flex-col space-y-4">
          {PRO_FEATURES.map((i) => (
            <PricingFeature
              key={`pro-${i}`}
              icon={CheckCircle2}
              iconClassName="size-5 shrink-0 text-primary"
              label={t(`pro.features.f${i}`)}
            />
          ))}
        </ul>
      </CardContent>
    </Card>
  )
}

function LifetimePricingCard({ t }: { t: PricingTranslator }): JSX.Element {
  return (
    <Card className="group relative flex flex-col overflow-visible border-amber-500/20 bg-linear-to-b from-amber-500/10 to-background/80 shadow-[0_0_30px_rgba(245,158,11,0.05)] backdrop-blur-md transition-all duration-300 hover:-translate-y-1 hover:border-amber-500/40 hover:from-amber-500/20 hover:to-background/90 hover:shadow-2xl hover:shadow-amber-500/10">
      <div className="pointer-events-none absolute inset-0 z-0 overflow-hidden rounded-lg">
        <div className="absolute inset-0 bg-linear-to-br from-amber-500/10 via-transparent to-transparent opacity-0 transition-opacity duration-500 group-hover:opacity-100" />
      </div>
      <CardHeader className="relative z-10 flex flex-col items-start pt-8">
        <CardTitle className="text-xl font-medium tracking-tight text-foreground">{t("lifetime.title")}</CardTitle>
        <CardDescription className="mb-4">{t("lifetime.description")}</CardDescription>
        <PricingPrice monthly={t("lifetime.priceMonthly")} period={t("lifetime.period")} yearly={t("lifetime.priceYearly")} />
      </CardHeader>
      <CardContent className="relative z-10 flex flex-1 flex-col pb-8">
        <Button
          variant="outline"
          size="lg"
          className="mb-8 h-12 w-full border-amber-500/30 bg-amber-500/5 text-base text-amber-500 transition-colors hover:bg-amber-500/10 hover:text-amber-500"
        >
          {t("lifetime.button")}
        </Button>
        <ul className="flex flex-1 flex-col space-y-4">
          {LIFETIME_FEATURES.map((i) => (
            <PricingFeature
              key={`lifetime-${i}`}
              icon={CheckCircle2}
              iconClassName="size-5 shrink-0 text-amber-500"
              label={t(`lifetime.features.f${i}`)}
            />
          ))}
        </ul>
      </CardContent>
    </Card>
  )
}

export { LifetimePricingCard, ProPricingCard, StarterPricingCard }
