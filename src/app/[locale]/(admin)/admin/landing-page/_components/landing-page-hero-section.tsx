import type { JSX } from "react"

import { Star } from "lucide-react"
import { getTranslations } from "next-intl/server"

import { Button } from "~/src/components/shadcn/button"

import { LandingPageSectionActions } from "~/src/app/[locale]/(admin)/admin/landing-page/_components/landing-page-section-actions"

export async function LandingPageHeroSection(): Promise<JSX.Element> {
  const t = await getTranslations("admin.landingPage")

  return (
    <div className="group relative overflow-hidden rounded-xl border border-border/10 bg-card p-12 text-center shadow-sm ring-2 ring-fuchsia-500">
      <div className="pointer-events-none absolute inset-0 bg-linear-to-b from-fuchsia-500/5 to-transparent" />
      <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 rounded-full bg-fuchsia-500 px-3 py-1 text-[10px] font-bold tracking-wider text-white uppercase shadow-lg">
        {t("sidebar.sections.hero")}
      </div>
      <LandingPageSectionActions />
      <div className="relative z-10 mx-auto max-w-2xl">
        <span className="mb-6 inline-flex items-center gap-2 rounded-full border border-fuchsia-500/20 bg-fuchsia-500/10 px-3 py-1 text-xs font-medium text-fuchsia-500">
          <Star className="size-3.5" />
          {t("canvas.newRelease")}
        </span>
        <h1 className="mb-6 text-4xl leading-tight font-semibold tracking-tight text-foreground md:text-5xl">
          {t("canvas.supercharge")}
          <span className="bg-linear-to-r from-fuchsia-500 to-purple-500 bg-clip-text text-transparent">{t("canvas.growth")}</span>
        </h1>
        <p className="mb-8 text-lg leading-relaxed text-muted-foreground">{t("canvas.description")}</p>
        <LandingPageHeroActions />
      </div>
    </div>
  )
}

async function LandingPageHeroActions(): Promise<JSX.Element> {
  const t = await getTranslations("admin.landingPage")

  return (
    <div className="flex items-center justify-center gap-4">
      <Button size="lg" className="h-12 px-8">
        {t("canvas.getStarted")}
      </Button>
      <Button size="lg" variant="outline" className="h-12 px-8">
        {t("canvas.bookDemo")}
      </Button>
    </div>
  )
}
