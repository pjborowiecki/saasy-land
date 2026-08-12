import type { JSX } from "react"

const STAT_CELL_SKELETON_COUNT = 3

/**
 * The skeleton is the same plate, at the same height, divided the same way. A loading state
 * whose shape does not match what arrives is a layout shift with extra steps.
 */
export function DashboardStatsGridSkeleton(): JSX.Element {
  return (
    <div aria-busy className="grid grid-cols-1 gap-px overflow-hidden rounded-xl bg-border ring-1 ring-foreground/10 sm:grid-cols-3">
      {Array.from({ length: STAT_CELL_SKELETON_COUNT }, (_, index) => (
        <div className="bg-card px-5 py-5" key={index}>
          <div className="h-2.5 w-24 animate-pulse rounded-xs bg-muted" />
          <div className="mt-4 h-7 w-16 animate-pulse rounded-sm bg-muted" />
        </div>
      ))}
    </div>
  )
}
