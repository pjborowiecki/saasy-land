import type { JSX } from "react"

export const PageFrame = (): JSX.Element => (
  <div aria-hidden className="pointer-events-none fixed inset-0 z-20 hidden justify-center lg:flex">
    <div className="h-full w-full max-w-7xl border-x border-border" />
  </div>
)
