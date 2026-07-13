"use client"

import { parseAsStringLiteral, useQueryState } from "nuqs"

/**
 * Client-side URL tab state. Prefer locale-aware `Link` tab triggers plus server `loadUsersPageSearchParams`
 * when tab panels fetch on the server (see admin users page).
 */
export function useQueryTab<const T extends string>(queryKey: string, values: readonly T[], defaultValue: T) {
  const parser = parseAsStringLiteral(values).withDefault(defaultValue).withOptions({ history: "push" })

  return useQueryState(queryKey, parser)
}
