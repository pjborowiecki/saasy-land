---
title: Validate JSON Parser Input
impact: CRITICAL
impactDescription: prevents runtime crashes and unsafe casts from URL-supplied JSON
tags: parser, parseAsJson, validation, standard-schema, zod
---

## Validate JSON Parser Input

`parseAsJson` requires a validator function (this is a hard requirement in nuqs v2 — calling `parseAsJson<T>()` with no argument is a TypeScript error). The validator must return the typed value when valid and either throw or return `null` when invalid. Avoid the "make the type errors go away" shortcut of an unchecked cast — URL params are attacker-controlled input, and an unchecked cast lets any shape into your app.

**Incorrect (unchecked cast as the validator):**

```tsx
'use client'
import { useQueryState, parseAsJson } from 'nuqs'

interface Filters {
  minPrice: number
  maxPrice: number
  categories: string[]
}

export default function FilterPanel() {
  const [filters, setFilters] = useQueryState(
    'filters',
    parseAsJson((v) => v as Filters) // Cast — no runtime check
  )
  // URL: ?filters={"minPrice":"haha"} → filters.minPrice is "haha", not a number
  // URL: ?filters=notjson → null, but downstream code expecting a string crashes

  return <div>Min: {filters?.minPrice.toFixed(2)}</div>
}
```

**Correct (hand-rolled type guard):**

```tsx
'use client'
import { useQueryState, parseAsJson } from 'nuqs'

interface Filters {
  minPrice: number
  maxPrice: number
  categories: string[]
}

function isFilters(value: unknown): value is Filters {
  if (!value || typeof value !== 'object') return false
  const obj = value as Record<string, unknown>
  return (
    typeof obj.minPrice === 'number' &&
    typeof obj.maxPrice === 'number' &&
    Array.isArray(obj.categories) &&
    obj.categories.every((c) => typeof c === 'string')
  )
}

export default function FilterPanel() {
  const [filters] = useQueryState(
    'filters',
    parseAsJson<Filters>((value) => (isFilters(value) ? value : null)).withDefault({
      minPrice: 0,
      maxPrice: 1000,
      categories: []
    })
  )
  // Invalid JSON → null → falls back to default

  return <div>Price: {filters.minPrice} – {filters.maxPrice}</div>
}
```

**Correct (Standard Schema — Zod, Valibot, ArkType, Effect Schema):**

Since nuqs v2.5 the validator slot accepts any Standard Schema parser directly — no `safeParse(...).success ? value : null` wrapper required. Zod's `.parse` throws on invalid input, which nuqs catches and converts to `null`.

```tsx
import { z } from 'zod'

const FiltersSchema = z.object({
  minPrice: z.number(),
  maxPrice: z.number(),
  categories: z.array(z.string())
})

const [filters] = useQueryState(
  'filters',
  parseAsJson(FiltersSchema.parse).withDefault({
    minPrice: 0,
    maxPrice: 1000,
    categories: []
  })
)
```

**When NOT to use this pattern:**
- For non-object types, prefer typed primitive parsers (`parseAsInteger`, `parseAsStringEnum`, `parseAsArrayOf`) — they're cheaper and the validator is implicit.

Reference: [nuqs Built-in Parsers](https://nuqs.dev/docs/parsers/built-in)
