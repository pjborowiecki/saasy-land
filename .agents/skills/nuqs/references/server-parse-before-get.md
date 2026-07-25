---
title: Call parse() Before get() in Server Components
impact: HIGH
impactDescription: prevents undefined values and runtime errors
tags: server, parse, get, searchParamsCache, initialization
---

## Call parse() Before get() in Server Components

`createSearchParamsCache` requires calling `parse()` at the page level before calling `get()` in nested components. Forgetting `parse()` causes `get()` to return undefined or throw.

**Incorrect (missing parse):**

```tsx
// app/search/page.tsx
import { ResultsHeader } from './ResultsHeader'

export default async function SearchPage({ searchParams }) {
  // Missing: await searchParamsCache.parse(searchParams)

  return (
    <div>
      <ResultsHeader /> {/* Will fail or return undefined */}
      <Results />
    </div>
  )
}

// components/ResultsHeader.tsx
import { searchParamsCache } from '@/lib/searchParams'

export function ResultsHeader() {
  const query = searchParamsCache.get('q') // Error: cache not initialized
  return <h1>Results for {query}</h1>
}
```

**Correct (parse at page level):**

```tsx
// app/search/page.tsx
import { searchParamsCache } from '@/lib/searchParams'
import { ResultsHeader } from './ResultsHeader'
import type { SearchParams } from 'nuqs/server'

type PageProps = {
  searchParams: Promise<SearchParams>
}

export default async function SearchPage({ searchParams }: PageProps) {
  // Parse FIRST, before rendering any children
  await searchParamsCache.parse(searchParams)

  return (
    <div>
      <ResultsHeader /> {/* Now get() works */}
      <Results />
    </div>
  )
}

// components/ResultsHeader.tsx
import { searchParamsCache } from '@/lib/searchParams'

export function ResultsHeader() {
  const query = searchParamsCache.get('q') // Works correctly
  return <h1>Results for {query}</h1>
}
```

**Parse and destructure in one step:**

```tsx
export default async function SearchPage({ searchParams }: PageProps) {
  const { q, page } = await searchParamsCache.parse(searchParams)
  // Use q and page directly, or let children use get()

  return <Results query={q} page={page} />
}
```

Reference: [nuqs Server Cache](https://nuqs.dev/docs/server-side)
