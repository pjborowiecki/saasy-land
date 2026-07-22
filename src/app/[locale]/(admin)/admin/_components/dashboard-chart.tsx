import type { JSX } from "react"

import { Card } from "~/src/presentation/components/shadcn/card"

import { DashboardChartHeader } from "~/src/app/[locale]/(admin)/admin/_components/dashboard-chart-header"
import { DashboardChartSvg } from "~/src/app/[locale]/(admin)/admin/_components/dashboard-chart-svg"

interface DashboardChartProps {
  readonly chartXAxis: readonly string[]
  readonly chartYAxis: readonly string[]
}

export function DashboardChart({ chartXAxis, chartYAxis }: DashboardChartProps): JSX.Element {
  return (
    <Card className="group relative overflow-hidden border-border/80 p-5 transition-colors hover:border-border/40">
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-secondary/50 to-transparent opacity-100 transition-opacity group-hover:opacity-0" />
      <DashboardChartHeader />

      <div className="relative h-[280px] w-full">
        <div className="absolute top-0 bottom-6 left-0 flex flex-col justify-between text-xs font-medium text-muted-foreground">
          {chartYAxis.map((label) => (
            <span key={label}>{label}</span>
          ))}
        </div>

        <div className="absolute top-2 right-0 bottom-8 left-10 flex flex-col justify-between">
          <div className="h-px w-full bg-border/40" />
          <div className="h-px w-full bg-border/40" />
          <div className="h-px w-full bg-border/40" />
          <div className="h-px w-full bg-border/40" />
        </div>

        <div className="absolute top-2 right-0 bottom-8 left-10">
          <DashboardChartSvg />
        </div>

        <div className="absolute right-0 bottom-0 left-10 flex justify-between text-xs font-medium text-muted-foreground">
          {chartXAxis.map((label) => (
            <span key={label}>{label}</span>
          ))}
        </div>
      </div>
    </Card>
  )
}
