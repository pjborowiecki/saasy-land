"use client"

import dynamic from "next/dynamic"
import type { JSX } from "react"

const Analytics = dynamic(
  async () => {
    const mod = await import("@vercel/analytics/next")
    return mod.Analytics
  },
  { ssr: false },
)

const SpeedInsights = dynamic(
  async () => {
    const mod = await import("@vercel/speed-insights/next")
    return mod.SpeedInsights
  },
  { ssr: false },
)

export function VercelObservability(): JSX.Element {
  return (
    <>
      <Analytics />
      <SpeedInsights />
    </>
  )
}
