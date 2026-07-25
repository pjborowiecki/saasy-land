import type { JSX } from "react"

const STAT_CARD_SKELETON_COUNT = 3

export function DashboardStatsGridSkeleton(): JSX.Element {
  return (
    <div aria-busy className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {Array.from({ length: STAT_CARD_SKELETON_COUNT }, (_, index) => (
        <div key={index} className="h-28 animate-pulse rounded-xl border border-border/60 bg-muted/30" />
      ))}
    </div>
  )
}
