import type { JSX } from "react"

export function UsersTabFallback(): JSX.Element {
  return <div aria-busy className="mt-6 h-64 animate-pulse rounded-lg bg-muted/40" />
}
