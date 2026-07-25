---
title: Define Shared Parsers in Dedicated File
impact: HIGH
impactDescription: prevents parser mismatch bugs between components
tags: setup, parsers, organization, reusability, consistency
---

## Define Shared Parsers in Dedicated File

When multiple components use the same URL parameters, define parsers in a shared file. This prevents mismatches where one component uses `parseAsInteger` and another uses `parseAsString` for the same parameter.

**Incorrect (duplicate parser definitions):**

```tsx
// components/Pagination.tsx
'use client'
import { useQueryState, parseAsInteger } from 'nuqs'

export function Pagination() {
  const [page, setPage] = useQueryState('page', parseAsInteger.withDefault(1))
  return <button onClick={() => setPage(p => p + 1)}>Next</button>
}

// components/PageInfo.tsx
'use client'
import { useQueryState } from 'nuqs'

export function PageInfo() {
  const [page] = useQueryState('page') // String parser - mismatch!
  return <span>Page: {page}</span> // Shows "1" not 1
}
```

**Correct (shared parsers):**

```tsx
// lib/searchParams.ts
import { parseAsInteger, parseAsString, parseAsStringLiteral } from 'nuqs'

export const searchParams = {
  page: parseAsInteger.withDefault(1),
  query: parseAsString.withDefault(''),
  sort: parseAsStringLiteral(['asc', 'desc'] as const).withDefault('asc')
}

// components/Pagination.tsx
'use client'
import { useQueryState } from 'nuqs'
import { searchParams } from '@/lib/searchParams'

export function Pagination() {
  const [page, setPage] = useQueryState('page', searchParams.page)
  return <button onClick={() => setPage(p => p + 1)}>Next</button>
}

// components/PageInfo.tsx
'use client'
import { useQueryState } from 'nuqs'
import { searchParams } from '@/lib/searchParams'

export function PageInfo() {
  const [page] = useQueryState('page', searchParams.page)
  return <span>Page: {page}</span> // Correctly typed as number
}
```

**Share the same map between client and server:**

The same parser map drives a Server Component's `createSearchParamsCache` (or `createLoader`) and a client `useQueryState`. Keep the server cache in its own module so `nuqs/server` never leaks into a client bundle, and import the parsers from a client-safe file:

```tsx
// lib/searchParams.server.ts — server-only
import { createSearchParamsCache } from 'nuqs/server'
import { searchParams } from './searchParams'

export const searchParamsCache = createSearchParamsCache(searchParams)
```

A default that disagrees across the boundary (server `withDefault(1)`, client `withDefault(0)`) is a classic hydration mismatch — the shared map makes it impossible.

**Benefits:**
- Single source of truth for parser configuration
- TypeScript catches mismatches at compile time
- Easy to update defaults in one place

Reference: [nuqs Documentation](https://nuqs.dev/docs)
