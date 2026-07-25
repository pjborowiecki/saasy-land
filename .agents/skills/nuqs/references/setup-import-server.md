---
title: Import Server Utilities from nuqs/server
impact: CRITICAL
impactDescription: prevents RSC-to-client boundary contamination errors
tags: setup, nuqs/server, imports, createSearchParamsCache, server-components
---

## Import Server Utilities from nuqs/server

Server-side utilities like `createSearchParamsCache` must be imported from `nuqs/server`, not `nuqs`. The main `nuqs` export includes the `'use client'` directive which contaminates Server Components.

**Incorrect (wrong import):**

```tsx
// lib/searchParams.ts
import { createSearchParamsCache, parseAsString } from 'nuqs'
// Error: This import adds 'use client' to your server code

export const searchParamsCache = createSearchParamsCache({
  q: parseAsString.withDefault('')
})
```

**Correct (server import):**

```tsx
// lib/searchParams.ts
import {
  createSearchParamsCache,
  parseAsString,
  parseAsInteger
} from 'nuqs/server'
// No 'use client' directive - safe for Server Components

export const searchParamsCache = createSearchParamsCache({
  q: parseAsString.withDefault(''),
  page: parseAsInteger.withDefault(1)
})
```

**Usage in Server Component:**

```tsx
// app/search/page.tsx
import { searchParamsCache } from '@/lib/searchParams'
import type { SearchParams } from 'nuqs/server'

type PageProps = {
  searchParams: Promise<SearchParams>
}

export default async function SearchPage({ searchParams }: PageProps) {
  const { q, page } = await searchParamsCache.parse(searchParams)

  return (
    <div>
      <h1>Results for: {q}</h1>
      <p>Page: {page}</p>
    </div>
  )
}
```

**What to import from where:**

| Import | Source | Use In |
|--------|--------|--------|
| `useQueryState`, `useQueryStates` | `nuqs` | Client Components |
| `createSearchParamsCache` | `nuqs/server` | Server Components |
| Parsers (`parseAsString`, etc.) | `nuqs/server` for server, `nuqs` for client | Either |

Reference: [nuqs Server-Side](https://nuqs.dev/docs/server-side)
