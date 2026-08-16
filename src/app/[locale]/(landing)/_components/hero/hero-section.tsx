import type { JSX, ReactNode } from "react"

import { ArrowRight } from "lucide-react"
import { getTranslations } from "next-intl/server"

import { InstallCommand } from "~/src/app/[locale]/(landing)/_components/hero/install-command"
import { Accent } from "~/src/app/[locale]/(landing)/_components/shared/accent"
import { ConceptLoop } from "~/src/app/[locale]/(landing)/_components/shared/concept-loop"
import { ROUTES } from "~/src/routes"

const HERO_TAGS = {
  accent: (chunks: ReactNode) => <Accent id="hero">{chunks}</Accent>,
  strong: (chunks: ReactNode) => <strong className="font-medium text-foreground">{chunks}</strong>,
}

export async function HeroSection(): Promise<JSX.Element> {
  const t = await getTranslations("pages.landing.hero")

  return (
    <section className="relative overflow-hidden" id="floor">
      <div aria-hidden className="field-grid pointer-events-none absolute inset-0" />
      <div aria-hidden className="field-signal pointer-events-none absolute inset-0" />

      <div className="relative mx-auto w-full max-w-7xl px-6 pt-32 pb-16 md:px-10 md:pt-40 md:pb-20">
        <h1 className="max-w-[11.6em] animate-in text-display-hero text-foreground duration-700 ease-exp fade-in-0 fill-mode-both slide-in-from-bottom-3 motion-reduce:animate-none">
          {t.rich("title", HERO_TAGS)}
        </h1>

        <p className="mt-6 max-w-2xl animate-in text-lead text-pretty text-muted-foreground delay-100 duration-700 ease-exp fade-in-0 fill-mode-both slide-in-from-bottom-3 motion-reduce:animate-none">
          {t.rich("description", HERO_TAGS)}
        </p>

        <div className="mt-9 flex animate-in flex-wrap items-center gap-x-3 gap-y-4 delay-200 duration-700 ease-exp fade-in-0 fill-mode-both slide-in-from-bottom-3 motion-reduce:animate-none">
          <a
            className="inline-flex h-11 items-center rounded-lg bg-primary px-5 text-body-sm font-semibold text-primary-foreground transition-[background-color,transform] duration-200 ease-exp hover:bg-primary/88 focus-visible:outline-2 focus-visible:outline-offset-3 focus-visible:outline-ring active:translate-y-px"
            href={ROUTES.HOME_PRICING_SECTION}
          >
            {t("ctaPrimary")}
          </a>
          <a
            className="group inline-flex h-11 items-center gap-1.5 rounded-lg border border-border bg-card/60 px-5 text-body-sm font-medium text-foreground transition-[background-color,border-color,transform] duration-200 ease-exp hover:bg-muted focus-visible:outline-2 focus-visible:outline-offset-3 focus-visible:outline-ring active:translate-y-px"
            href={ROUTES.HOME_FOUNDATION_SECTION}
          >
            {t("ctaSecondary")}
            <ArrowRight
              aria-hidden
              className="size-3.5 text-muted-foreground transition-transform duration-200 ease-exp group-hover:translate-x-0.5 motion-reduce:transition-none"
              strokeWidth={2}
            />
          </a>
        </div>

        <div className="mt-16 animate-in overflow-hidden rounded-xl border border-border bg-card delay-300 duration-1000 ease-exp fade-in-0 fill-mode-both slide-in-from-bottom-4 motion-reduce:animate-none md:mt-20">
          <InstallCommand copiedLabel={t("surface.copied")} copyLabel={t("surface.copy")} runnerLabel={t("surface.runner")} />
          <ConceptLoop
            className="w-[190%] max-w-none border-t border-border sm:w-[135%] md:w-full"
            label={t("surface.imageAlt")}
            name="app-tour"
          />
        </div>
      </div>
    </section>
  )
}
