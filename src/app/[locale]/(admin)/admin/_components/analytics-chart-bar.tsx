"use client"

import type { CSSProperties, JSX } from "react"

import { EMPTY_STRING_LENGTH } from "~/src/app/[locale]/(admin)/admin/_lib/constants"

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

const PRIMARY_HEIGHT_STYLES: Record<string, CSSProperties> = {
  "1": { height: "45%" },
  "10": { height: "30%" },
  "11": { height: "65%" },
  "12": { height: "75%" },
  "13": { height: "90%" },
  "14": { height: "80%" },
  "15": { height: "60%" },
  "16": { height: "50%" },
  "17": { height: "70%" },
  "18": { height: "40%" },
  "2": { height: "35%" },
  "3": { height: "60%" },
  "4": { height: "50%" },
  "5": { height: "40%" },
  "6": { height: "70%" },
  "7": { height: "85%" },
  "8": { height: "55%" },
  "9": { height: "45%" },
}

const SECONDARY_HEIGHT_STYLES: Record<string, CSSProperties> = {
  "1": { height: "15%" },
  "10": { height: "20%" },
  "11": { height: "15%" },
  "12": { height: "20%" },
  "13": { height: "10%" },
  "14": { height: "12%" },
  "15": { height: "25%" },
  "16": { height: "35%" },
  "17": { height: "20%" },
  "18": { height: "15%" },
  "2": { height: "20%" },
  "3": { height: "25%" },
  "4": { height: "30%" },
  "5": { height: "22%" },
  "6": { height: "18%" },
  "7": { height: "15%" },
  "8": { height: "25%" },
  "9": { height: "35%" },
}

export function AnalyticsChartBar({ bar }: AnalyticsChartBarProps): JSX.Element {
  const isActive = bar.active === true
  const hasLabel = bar.label !== undefined && bar.label.length > EMPTY_STRING_LENGTH

  return (
    <div className="group relative flex h-full flex-1 flex-col justify-end">
      <div
        className={`w-full rounded-t-[2px] transition-all duration-300 ${isActive ? "bg-primary shadow-[0_0_15px_rgba(232,121,249,0.3)]" : "bg-primary/80 group-hover:bg-primary"}`}
        style={PRIMARY_HEIGHT_STYLES[bar.id]}
      />
      <div
        className={`w-full rounded-b-[2px] transition-all duration-300 ${isActive ? "bg-primary/20" : "bg-secondary group-hover:bg-secondary/80"}`}
        style={SECONDARY_HEIGHT_STYLES[bar.id]}
      />
      {hasLabel ? (
        <div
          className={`absolute bottom-full left-1/2 z-20 mb-2 -translate-x-1/2 rounded border px-2.5 py-1.5 text-xs whitespace-nowrap shadow-xl ${isActive ? "border-border/10 bg-foreground font-semibold text-background" : "hidden border-border/10 bg-secondary font-medium text-foreground group-hover:block"}`}
        >
          {bar.label}
        </div>
      ) : undefined}
    </div>
  )
}
