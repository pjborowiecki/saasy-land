---
title: Use Standard Schema for Cross-Library Validation
impact: MEDIUM
impactDescription: one parser map validates nuqs, tRPC, route validators, and forms — no duplicated schema
tags: state, standard-schema, zod, valibot, trpc, validation
---

## Use Standard Schema for Cross-Library Validation

Since nuqs v2.5, every `parseAsX` builder implements the [Standard Schema](https://standardschema.dev) interface, and `parseAsJson` accepts any Standard Schema validator (Zod, Valibot, ArkType, Effect Schema, …) directly in the validator slot. That means one parser map can drive **all of**: client-side `useQueryState`, server-side `createSearchParamsCache`/`createLoader`, tRPC procedure inputs, TanStack Router search-param validation, and form-level validation — without redefining the schema in three places.

**Incorrect (shape defined in three places, drift inevitable):**

```ts
// lib/searchParams.ts
import { parseAsString, parseAsInteger } from 'nuqs'
export const searchParams = {
  q: parseAsString.withDefault(''),
  page: parseAsInteger.withDefault(1)
}

// server/trpc/search.ts
import { z } from 'zod'
export const searchInput = z.object({
  q: z.string().default(''),
  page: z.number().int().default(1) // Default '1' here, '0' somewhere else — bug waiting to happen
})

// server/route-validator.ts
export function validateSearch(v: unknown) {
  // Hand-rolled — drifts from both of the above
}
```

**Correct (one nuqs parser map, consumed everywhere via Standard Schema):**

```ts
// lib/searchParams.ts
import { parseAsString, parseAsInteger, createStandardSchemaV1 } from 'nuqs'

export const searchParamsMap = {
  q: parseAsString.withDefault(''),
  page: parseAsInteger.withDefault(1)
}

// Expose the same map as a Standard Schema for any v1-compatible consumer
export const searchParamsSchema = createStandardSchemaV1(searchParamsMap)
```

```ts
// server/trpc/search.ts — tRPC v11 accepts Standard Schemas
import { publicProcedure } from '@/server/trpc'
import { searchParamsSchema } from '@/lib/searchParams'

export const search = publicProcedure
  .input(searchParamsSchema)
  .query(({ input }) => {
    // input is { q: string; page: number }
    return runSearch(input.q, input.page)
  })
```

```tsx
// app/search/page.tsx (client) — same map
'use client'
import { useQueryStates } from 'nuqs'
import { searchParamsMap } from '@/lib/searchParams'

export default function Filters() {
  const [{ q, page }, setSearch] = useQueryStates(searchParamsMap)
  return <SearchUI q={q} page={page} onChange={setSearch} />
}
```

**Using a Standard Schema library inside `parseAsJson`:**

`parseAsJson` accepts any Standard Schema validator directly — Zod 4+, Valibot 0.30+, ArkType, and Effect Schema all qualify.

```tsx
import { z } from 'zod'
import { parseAsJson, useQueryState } from 'nuqs'

const FiltersSchema = z.object({
  minPrice: z.number(),
  categories: z.array(z.string())
})

const [filters] = useQueryState(
  'filters',
  parseAsJson(FiltersSchema).withDefault({ minPrice: 0, categories: [] })
)
// Invalid JSON → null → falls back to the default
```

**When NOT to use this pattern:**
- The shape only lives in one file and one consumer — keep it simple with plain parsers; the Standard Schema indirection adds zero value.
- You're on nuqs < 2.5 — `createStandardSchemaV1` doesn't exist there. Either upgrade or write the bridge by hand.

Reference: [nuqs 2.5 release notes](https://nuqs.dev/blog/nuqs-2.5)
