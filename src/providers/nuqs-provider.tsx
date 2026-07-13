"use client"

import type { JSX, ReactNode } from "react"

import { NuqsAdapter } from "nuqs/adapters/next/app"

/** App-router client adapter for URL search-param state (nuqs). */
export function NuqsProvider({ children }: Readonly<{ children: ReactNode }>): JSX.Element {
  return <NuqsAdapter>{children}</NuqsAdapter>
}
