import type { JSX } from "react"

import { getTranslations } from "next-intl/server"

export async function DashboardChartSvg(): Promise<JSX.Element> {
  const t = await getTranslations("admin.dashboard")
  return (
    <svg viewBox="0 0 1000 240" preserveAspectRatio="none" className="h-full w-full overflow-visible">
      <title>{t("chart.title")}</title>
      <defs>
        <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
          <stop offset="5%" stopColor="var(--primary)" stopOpacity="0.3" />
          <stop offset="95%" stopColor="var(--primary)" stopOpacity="0" />
        </linearGradient>
      </defs>
      <path
        d="M0,180 C100,150 200,200 300,120 C400,60 500,130 600,100 C700,80 800,160 900,60 L1000,40 L1000,240 L0,240 Z"
        fill="url(#colorRevenue)"
      />
      <path
        d="M0,180 C100,150 200,200 300,120 C400,60 500,130 600,100 C700,80 800,160 900,60 L1000,40"
        fill="none"
        stroke="var(--primary)"
        strokeWidth="2.5"
        vectorEffect="non-scaling-stroke"
      />
      <circle cx="900" cy="60" r="4" fill="var(--background)" stroke="var(--primary)" strokeWidth="2" className="cursor-pointer" />
    </svg>
  )
}
