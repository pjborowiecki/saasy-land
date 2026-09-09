import type { JSX } from "react"

export interface AnalyticsChartBarData {
  active?: boolean
  height1: string
  height2: string
  id: string
  label?: string
}

interface AnalyticsChartBarProps {
  readonly bar: AnalyticsChartBarData
}

export const AnalyticsChartBar = ({ bar }: AnalyticsChartBarProps): JSX.Element => {
  const isActive = bar.active === true
  const hasLabel = bar.label !== undefined && bar.label.length > 0

  return (
    <div className="group relative flex h-full flex-1 flex-col justify-end">
      <div
        className={`w-full rounded-t-xs transition-colors duration-300 ease-exp ${isActive ? "bg-chart-1" : "bg-chart-1/45 group-hover:bg-chart-1/70"}`}
        style={{ height: bar.height1 }}
      />
      <div
        className={`w-full rounded-b-xs transition-colors duration-300 ease-exp ${isActive ? "bg-chart-2" : "bg-chart-2/45 group-hover:bg-chart-2/70"}`}
        style={{ height: bar.height2 }}
      />
      {hasLabel ? (
        <div
          className={`absolute bottom-full left-1/2 z-20 mb-2 -translate-x-1/2 rounded-md border border-border px-2 py-1 font-mono text-[0.6875rem] whitespace-nowrap tabular-nums ${isActive ? "bg-foreground font-medium text-background" : "hidden bg-popover text-foreground group-hover:block"}`}
        >
          {bar.label}
        </div>
      ) : undefined}
    </div>
  )
}
