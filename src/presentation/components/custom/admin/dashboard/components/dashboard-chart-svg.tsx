import type { JSX } from "react"

import { useTranslations } from "use-intl/react"

/** The series, once. Both paths trace the same curve; the filled one closes it to the baseline. */
const SERIES_PATH = "M0,180 C100,150 200,200 300,120 C400,60 500,130 600,100 C700,80 800,160 900,60 L1000,40"

export const DashboardChartSvg = (): JSX.Element => {
  const t = useTranslations("pages.admin.dashboard")

  return (
    <svg className="h-full w-full overflow-visible" preserveAspectRatio="none" viewBox="0 0 1000 240">
      <title>{t("chart.title")}</title>
      <defs>
        {/*
         * `--chart-1`, not `--primary`. Primary is monochrome in this system, so a fill derived
         * from it would be a grey wash; the chart ramp is where the palette keeps its chroma,
         * and a single series should be the one coloured thing in the card.
         */}
        <linearGradient id="dashboardRevenueFill" x1="0" x2="0" y1="0" y2="1">
          <stop offset="0%" stopColor="var(--chart-1)" stopOpacity="0.22" />
          <stop offset="100%" stopColor="var(--chart-1)" stopOpacity="0" />
        </linearGradient>
      </defs>
      <path d={`${SERIES_PATH} L1000,240 L0,240 Z`} fill="url(#dashboardRevenueFill)" />
      <path d={SERIES_PATH} fill="none" stroke="var(--chart-1)" strokeLinecap="round" strokeWidth="2" vectorEffect="non-scaling-stroke" />
      {/* The head of the series, ringed in the card fill so it reads as a marker on the line. */}
      <circle cx="1000" cy="40" fill="var(--chart-1)" r="3.5" stroke="var(--card)" strokeWidth="2.5" vectorEffect="non-scaling-stroke" />
    </svg>
  )
}
