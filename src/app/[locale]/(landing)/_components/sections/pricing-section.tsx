"use client"

import { type JSX, useState } from "react"

import { CheckCircle2, XCircle } from "lucide-react"
import { useTranslations } from "next-intl"

import { Badge } from "~/src/components/shadcn/badge"
import { Button } from "~/src/components/shadcn/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "~/src/components/shadcn/card"
import { Switch } from "~/src/components/shadcn/switch"

export function PricingSection(): JSX.Element {
  const t = useTranslations("landingPage.pricing")
  const [isYearly, setIsYearly] = useState<boolean>(false)

  return (
    <section className="relative z-10 mx-auto max-w-7xl px-6 py-16 md:py-24">
      <div className="mx-auto mb-20 max-w-2xl text-center">
        <h2 className="mb-6 font-medium text-4xl text-foreground tracking-tight md:text-5xl">
          {t("titlePart1")}
          <span className="bg-linear-to-r from-primary to-primary/60 bg-clip-text text-transparent">{t("titlePart2")}</span>
        </h2>
        <p className="font-normal text-lg text-muted-foreground">{t("description")}</p>
      </div>

      <div className="mb-16 flex items-center justify-center gap-4">
        <span className="font-medium text-muted-foreground text-sm">{t("monthly")}</span>
        <Switch checked={isYearly} onCheckedChange={setIsYearly} />
        <span className="flex items-center gap-2 font-medium text-foreground text-sm">
          {t("yearly")}
          <Badge variant="outline" className="border-primary/20 bg-primary/10 text-primary">
            {t("save20")}
          </Badge>
        </span>
      </div>

      <div className="relative mx-auto grid max-w-[1100px] grid-cols-1 gap-8 md:grid-cols-3 lg:gap-8">
        <div className="pointer-events-none absolute top-1/2 left-1/2 -z-10 h-[400px] w-full max-w-2xl -translate-x-1/2 -translate-y-1/2 rounded-full bg-primary/15 blur-[120px]" />

        <Card className="group relative flex flex-col overflow-visible border-border/50 bg-background/80 backdrop-blur-md transition-all duration-300 hover:-translate-y-1 hover:border-border hover:bg-muted/80 hover:shadow-2xl hover:shadow-primary/10">
          <div className="pointer-events-none absolute inset-0 z-0 overflow-hidden rounded-lg">
            <div className="absolute inset-0 bg-linear-to-br from-primary/5 via-transparent to-transparent opacity-0 transition-opacity duration-500 group-hover:opacity-100" />
          </div>
          <CardHeader className="relative z-10 flex flex-col items-start pt-8">
            <CardTitle className="font-medium text-foreground text-xl tracking-tight">{t("starter.title")}</CardTitle>
            <CardDescription className="mb-4">{t("starter.description")}</CardDescription>
            <div className="flex items-baseline gap-2">
              <span className="font-medium text-5xl text-foreground tracking-tight">
                {isYearly ? t("starter.priceYearly") : t("starter.priceMonthly")}
              </span>
              <span className="text-muted-foreground text-sm">{t("starter.period")}</span>
            </div>
          </CardHeader>
          <CardContent className="relative z-10 flex flex-1 flex-col pb-8">
            <Button variant="outline" size="lg" className="mb-8 h-12 w-full bg-background/50 text-base">
              {t("starter.button")}
            </Button>
            <ul className="flex flex-1 flex-col space-y-4">
              {[1, 2, 3].map((i) => (
                <li key={`starter-${i}`} className="flex items-center gap-3 text-foreground text-sm">
                  <CheckCircle2 className="size-5 shrink-0 text-primary" />
                  <span>{t(`starter.features.f${i}`)}</span>
                </li>
              ))}
              {[4, 5].map((i) => (
                <li key={`starter-no-${i}`} className="flex items-center gap-3 text-muted-foreground text-sm">
                  <XCircle className="size-5 shrink-0" />
                  <span>{t(`starter.features.f${i}`)}</span>
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>

        <Card className="group relative flex flex-col overflow-visible border-primary/20 bg-background/80 shadow-[0_0_40px_rgba(217,70,239,0.05)] backdrop-blur-md transition-all duration-300 hover:-translate-y-1 hover:border-primary/40 hover:bg-muted/80 hover:shadow-2xl hover:shadow-primary/20">
          <div className="pointer-events-none absolute inset-0 z-0 overflow-hidden rounded-lg">
            <div className="absolute inset-0 bg-linear-to-br from-primary/10 via-transparent to-transparent opacity-0 transition-opacity duration-500 group-hover:opacity-100" />
          </div>
          <Badge className="absolute -top-3 left-1/2 z-20 -translate-x-1/2 whitespace-nowrap bg-linear-to-r from-primary to-primary/60 px-4 py-1 text-xs shadow-lg">
            {t("pro.badge")}
          </Badge>
          <CardHeader className="relative z-10 flex flex-col items-start pt-8">
            <CardTitle className="font-medium text-foreground text-xl tracking-tight">{t("pro.title")}</CardTitle>
            <CardDescription className="mb-4">{t("pro.description")}</CardDescription>
            <div className="flex items-baseline gap-2">
              <span className="font-medium text-5xl text-foreground tracking-tight">
                {isYearly ? t("pro.priceYearly") : t("pro.priceMonthly")}
              </span>
              <span className="text-muted-foreground text-sm">{t("pro.period")}</span>
            </div>
          </CardHeader>
          <CardContent className="relative z-10 flex flex-1 flex-col pb-8">
            <Button
              size="lg"
              className="mb-8 h-12 w-full bg-linear-to-b from-primary to-primary/80 text-base text-primary-foreground shadow-[0_0_15px_-3px_var(--color-primary)] transition-all hover:opacity-90"
            >
              {t("pro.button")}
            </Button>
            <ul className="flex flex-1 flex-col space-y-4">
              {[1, 2, 3, 4, 5].map((i) => (
                <li key={`pro-${i}`} className="flex items-center gap-3 text-foreground text-sm">
                  <CheckCircle2 className="size-5 shrink-0 text-primary" />
                  <span>{t(`pro.features.f${i}`)}</span>
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>

        <Card className="group relative flex flex-col overflow-visible border-amber-500/20 bg-linear-to-b from-amber-500/10 to-background/80 shadow-[0_0_30px_rgba(245,158,11,0.05)] backdrop-blur-md transition-all duration-300 hover:-translate-y-1 hover:border-amber-500/40 hover:from-amber-500/20 hover:to-background/90 hover:shadow-2xl hover:shadow-amber-500/10">
          <div className="pointer-events-none absolute inset-0 z-0 overflow-hidden rounded-lg">
            <div className="absolute inset-0 bg-linear-to-br from-amber-500/10 via-transparent to-transparent opacity-0 transition-opacity duration-500 group-hover:opacity-100" />
          </div>
          <CardHeader className="relative z-10 flex flex-col items-start pt-8">
            <CardTitle className="font-medium text-foreground text-xl tracking-tight">{t("lifetime.title")}</CardTitle>
            <CardDescription className="mb-4">{t("lifetime.description")}</CardDescription>
            <div className="flex items-baseline gap-2">
              <span className="font-medium text-5xl text-foreground tracking-tight">
                {isYearly ? t("lifetime.priceYearly") : t("lifetime.priceMonthly")}
              </span>
              <span className="text-muted-foreground text-sm">{t("lifetime.period")}</span>
            </div>
          </CardHeader>
          <CardContent className="relative z-10 flex flex-1 flex-col pb-8">
            <Button
              variant="outline"
              size="lg"
              className="mb-8 h-12 w-full border-amber-500/30 bg-amber-500/5 text-amber-500 text-base transition-colors hover:bg-amber-500/10 hover:text-amber-500"
            >
              {t("lifetime.button")}
            </Button>
            <ul className="flex flex-1 flex-col space-y-4">
              {[1, 2, 3, 4, 5].map((i) => (
                <li key={`lifetime-${i}`} className="flex items-center gap-3 text-foreground text-sm">
                  <CheckCircle2 className="size-5 shrink-0 text-amber-500" />
                  <span>{t(`lifetime.features.f${i}`)}</span>
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>
      </div>
    </section>
  )
}
