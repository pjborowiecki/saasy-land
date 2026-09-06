import type { JSX } from "react"

import { useTranslations } from "use-intl/react"

import { Button } from "~/src/presentation/components/shadcn/button"

import { LandingPageSectionActions } from "~/src/presentation/components/custom/admin/landing-page/components/landing-page-section-actions"

const LandingPageHeroActions = (): JSX.Element => {
  const t = useTranslations("pages.admin.landing-page")

  return (
    <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
      <Button size="lg" className="h-12 px-8">
        {t("canvas.getStarted")}
      </Button>
      <Button size="lg" variant="outline" className="h-12 px-8">
        {t("canvas.bookDemo")}
      </Button>
    </div>
  )
}

/**
 * The selected section on the canvas. Selection is a state, so it is drawn in the accent: a 1px
 * hairline in `--ring` plus a high-contrast chip, never a glow or a raised card.
 */
export const LandingPageHeroSection = (): JSX.Element => {
  const t = useTranslations("pages.admin.landing-page")

  return (
    <section aria-label={t("sidebar.sections.hero")} className="group relative border border-ring bg-card px-6 py-14 sm:px-12">
      <span className="absolute -top-px -left-px bg-foreground px-2 py-1 font-mono text-label text-background uppercase">
        {t("sidebar.sections.hero")}
      </span>
      <LandingPageSectionActions />

      <div className="mx-auto max-w-2xl text-center">
        <span className="inline-flex items-center border border-border bg-background px-2.5 py-1 text-body-sm font-medium text-muted-foreground">
          {t("canvas.badge")}
        </span>
        <p className="mt-6 text-4xl leading-tight font-semibold tracking-tight text-balance text-foreground md:text-5xl">
          {t("canvas.headingLead")} <span className="text-ring">{t("canvas.headingAccent")}</span>
        </p>
        <p className="mt-6 text-lg leading-relaxed text-pretty text-muted-foreground">{t("canvas.description")}</p>
        <LandingPageHeroActions />
      </div>
    </section>
  )
}
