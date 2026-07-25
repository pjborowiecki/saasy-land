---
title: Use createSearchParamsCache for Server Components
impact: HIGH
impactDescription: eliminates prop drilling across N component levels
tags: server, createSearchParamsCache, server-components, type-safety
---

## Use createSearchParamsCache for Server Components

In Server Components, use `createSearchParamsCache` to access URL parameters with type safety. This avoids prop drilling and provides the same parsers as client-side hooks.

**Incorrect (manual parsing):**

```tsx
// app/search/page.tsx
type PageProps = {
  searchParams: Promise<{ q?: string; page?: string }>
}

export default async function SearchPage({ searchParams }: PageProps) {
  const params = await searchParams
  const query = params.q ?? ''
  const page = parseInt(params.page ?? '1', 10) // Manual parsing
  // No type safety, parsing logic duplicated

  return <Results query={query} page={page} />
}
```

**Correct (search params cache):**

```tsx
// lib/searchParams.ts
import {
  createSearchParamsCache,
  parseAsString,
  parseAsInteger
} from 'nuqs/server'

export const searchParamsCache = createSearchParamsCache({
  q: parseAsString.withDefault(''),
  page: parseAsInteger.withDefault(1)
})

// app/search/page.tsx
import { searchParamsCache } from '@/lib/searchParams'
import type { SearchParams } from 'nuqs/server'

type PageProps = {
  searchParams: Promise<SearchParams>
}

export default async function SearchPage({ searchParams }: PageProps) {
  // Parse once at page level
  const { q, page } = await searchParamsCache.parse(searchParams)

  return <Results query={q} page={page} />
}
```

**Access in nested Server Components:**

```tsx
// components/ResultsHeader.tsx
import { searchParamsCache } from '@/lib/searchParams'

export function ResultsHeader() {
  // No props needed - access from cache
  const query = searchParamsCache.get('q')
  const page = searchParamsCache.get('page')

  return <h1>Results for "{query}" (Page {page})</h1>
}
```

**Important:** Call `parse()` once at the page level before using `get()` in nested components.

**Alternative: `createLoader` for non-nested cases.** If you only consume the parsed values inside the page itself (no deeply nested Server Components needing `get()`), `createLoader` is the lighter primitive — it returns a single function and skips the React-cache plumbing. Use the cache when you'd otherwise prop-drill; use the loader when you wouldn't.

```tsx
// lib/searchParams.ts
import { createLoader, parseAsString, parseAsInteger } from 'nuqs/server'

export const loadSearchParams = createLoader({
  q: parseAsString.withDefault(''),
  page: parseAsInteger.withDefault(1)
})

// app/search/page.tsx
import { loadSearchParams } from '@/lib/searchParams'

export default async function SearchPage({ searchParams }) {
  const { q, page } = await loadSearchParams(searchParams)
  return <Results query={q} page={page} />
}
```

The same parser map can power **both** `createSearchParamsCache` and `createLoader` (and a client-side `useQueryStates`), so the choice is purely about ergonomics — see `setup-shared-parsers`.

Reference: [nuqs Server-Side](https://nuqs.dev/docs/server-side)
