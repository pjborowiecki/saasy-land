import type { JSX } from "react"

export function Background(): JSX.Element {
  return (
    <>
      <div className="pointer-events-none fixed inset-0 z-0 bg-[linear-gradient(to_right,var(--color-border)_1px,transparent_1px),linear-gradient(to_bottom,var(--color-border)_1px,transparent_1px)] bg-size-[24px_24px] opacity-20" />
      <div className="pointer-events-none fixed top-0 left-1/2 z-0 h-[500px] w-full max-w-3xl -translate-x-1/2 rounded-full bg-primary/10 blur-[80px]" />
    </>
  )
}
