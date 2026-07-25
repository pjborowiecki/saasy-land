"use client"

import type { JSX, ReactNode } from "react"

import { NuqsAdapter } from "nuqs/adapters/next/app"

const NUQS_DEFAULT_OPTIONS = {
  history: "push",
  scroll: false,
  shallow: false,
} as const

export function NuqsProvider({ children }: Readonly<{ children: ReactNode }>): JSX.Element {
  return <NuqsAdapter defaultOptions={NUQS_DEFAULT_OPTIONS}>{children}</NuqsAdapter>
}
