"use client"

import { parseAsStringLiteral, useQueryState } from "nuqs"

/** Generic URL tab helper when a client component must own `?tab=` state. */
export function useQueryTab<const T extends string>(queryKey: string, values: readonly T[], defaultValue: T) {
  return useQueryState(queryKey, parseAsStringLiteral(values).withDefault(defaultValue))
}
