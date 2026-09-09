import type { JSX } from "react"

import { ArrowRight } from "lucide-react"
import { useTranslations } from "use-intl/react"

import { Accent } from "~/src/presentation/components/custom/landing-page/components/accent"
import { Reveal } from "~/src/presentation/components/custom/landing-page/components/reveal"

import { ROUTES } from "~/src/routes"

const LINE_STEP_MS = 120
const SECOND_LINE_DELAY_MS = 240

export const ManifestoSection = (): JSX.Element => {
  const t = useTranslations("pages.landing.manifesto")

  return (
    <section className="relative border-t border-border" id="manifesto">
      <div className="mx-auto w-full max-w-7xl px-6 py-24 md:px-10 md:py-28">
        <Reveal variant="quiet">
          <p className="max-w-[24ch] text-headline-peak text-balance text-foreground">{t("p1")}</p>
        </Reveal>
        <Reveal variant="quiet" delay={LINE_STEP_MS}>
          <p className="mt-8 max-w-[43.5rem] text-statement text-pretty text-muted-foreground">{t("p2")}</p>
        </Reveal>
        <Reveal variant="block" delay={SECOND_LINE_DELAY_MS}>
          <div className="mt-12 flex">
            <a
              className="group inline-flex items-center gap-4 text-display-gate text-foreground focus-visible:outline-2 focus-visible:outline-offset-6 focus-visible:outline-ring"
              href={ROUTES.HOME_PRICING_SECTION}
            >
              <Accent id="manifesto">{t("p3")}</Accent>
              <ArrowRight
                aria-hidden
                className="size-[0.62em] shrink-0 text-ring transition-transform duration-200 ease-exp group-hover:translate-x-1.5 motion-reduce:transition-none"
                strokeWidth={2.5}
              />
            </a>
          </div>
        </Reveal>
      </div>
    </section>
  )
}
