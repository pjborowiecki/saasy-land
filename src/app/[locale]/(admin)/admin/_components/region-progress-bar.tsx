"use client"

import type { CSSProperties, JSX } from "react"

interface RegionProgressBarProps {
  readonly percentage: number
}

const REGION_WIDTH_STYLES: Record<number, CSSProperties> = Object.fromEntries(
  Array.from({ length: 101 }, (_, percentage) => [percentage, { width: `${String(percentage)}%` }]),
)

export function RegionProgressBar({ percentage }: RegionProgressBarProps): JSX.Element {
  return <div className="h-full rounded-full bg-primary" style={REGION_WIDTH_STYLES[percentage]} />
}
