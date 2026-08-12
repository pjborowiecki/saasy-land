import type { JSX } from "react"

import { Card } from "~/src/presentation/components/shadcn/card"

import { DashboardChartHeader } from "~/src/app/[locale]/(admin)/admin/dashboard/_components/dashboard-chart-header"
import { DashboardChartSvg } from "~/src/app/[locale]/(admin)/admin/dashboard/_components/dashboard-chart-svg"

const CHART_Y_AXIS_LABELS = ["$30k", "$20k", "$10k", "$0"] as const
const CHART_X_AXIS_LABELS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"] as const

const GRIDLINE_COUNT = 4

interface DashboardChartProps {
  readonly chartXAxis?: readonly string[]
  readonly chartYAxis?: readonly string[]
}

/**
 * Axis labels are monospace and tabular, because they are measurements. Gridlines are the
 * hairline token at a single weight, not two weights of grey, and there is no gradient wash
 * over the plot: the series is the only thing in the card carrying colour, which is what makes
 * a single accent line readable at a glance.
 */
export function DashboardChart({ chartXAxis = CHART_X_AXIS_LABELS, chartYAxis = CHART_Y_AXIS_LABELS }: DashboardChartProps): JSX.Element {
  return (
    <Card className="gap-0 p-5">
      <DashboardChartHeader />

      <div className="relative mt-7 h-70 w-full">
        <div className="absolute top-0 bottom-6 left-0 flex flex-col justify-between font-mono text-[0.6875rem] text-muted-foreground tabular-nums">
          {chartYAxis.map((label) => (
            <span key={label}>{label}</span>
          ))}
        </div>

        <div className="absolute top-2 right-0 bottom-8 left-11 flex flex-col justify-between">
          {Array.from({ length: GRIDLINE_COUNT }, (_, index) => (
            <div className="h-px w-full bg-border" key={index} />
          ))}
        </div>

        <div className="absolute top-2 right-0 bottom-8 left-11">
          <DashboardChartSvg />
        </div>

        <div className="absolute right-0 bottom-0 left-11 flex justify-between font-mono text-[0.6875rem] text-muted-foreground">
          {chartXAxis.map((label) => (
            <span key={label}>{label}</span>
          ))}
        </div>
      </div>
    </Card>
  )
}
