import type { JSX } from "react"

import { useTranslations } from "use-intl/react"

import { Reveal } from "~/src/presentation/components/custom/landing-page/components/reveal"
import { StationCell, StationGrid } from "~/src/presentation/components/custom/landing-page/components/station-grid"

const STATIONS = [
  { id: "auth", loop: "cost-curve", offsetSeconds: 0 },
  { id: "tests", loop: "merge-gate", offsetSeconds: 2 },
  { id: "i18n", loop: "locale-format", offsetSeconds: 4 },
  { id: "edge", loop: "scaffold-cli", offsetSeconds: 6 },
] as const

const GRID_DELAY_MS = 100

export const LineSection = (): JSX.Element => {
  const t = useTranslations("pages.landing.line")

  return (
    <section className="relative border-t border-border" id="foundation">
      <div className="mx-auto w-full max-w-7xl px-6 py-24 md:px-10 md:py-32">
        <Reveal variant="heading">
          <h2 className="max-w-[16ch] text-headline-peak text-balance text-foreground">{t("title")}</h2>
          <p className="mt-5 max-w-2xl text-lead text-pretty text-muted-foreground">{t("description")}</p>
        </Reveal>

        <Reveal className="mt-14 md:mt-20" delay={GRID_DELAY_MS}>
          <StationGrid>
            {STATIONS.map((station) => (
              <StationCell
                body={t(`stations.${station.id}.body`)}
                id={station.id}
                key={station.id}
                loop={station.loop}
                offsetSeconds={station.offsetSeconds}
                spec={t(`stations.${station.id}.spec`)}
                title={t(`stations.${station.id}.title`)}
              />
            ))}
          </StationGrid>
        </Reveal>
      </div>
    </section>
  )
}
