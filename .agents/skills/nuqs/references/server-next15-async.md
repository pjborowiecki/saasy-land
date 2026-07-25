---
title: Handle Async searchParams in Next.js 15+
impact: HIGH
impactDescription: prevents build errors in Next.js 15 with async props
tags: server, nextjs15, async, searchParams, promise
---

## Handle Async searchParams in Next.js 15+

In Next.js 15+, `searchParams` is a Promise that must be awaited. Using it directly without await causes TypeScript errors and runtime issues.

**Incorrect (Next.js 15+ without await):**

```tsx
// app/search/page.tsx
import { searchParamsCache } from '@/lib/searchParams'

type PageProps = {
  searchParams: { q?: string } // Wrong type for Next.js 15+
}

export default async function SearchPage({ searchParams }: PageProps) {
  // searchParams is a Promise, not an object
  const { q } = searchParamsCache.parse(searchParams) // Type error
}
```

**Correct (Next.js 15+):**

```tsx
// app/search/page.tsx
import { searchParamsCache } from '@/lib/searchParams'
import type { SearchParams } from 'nuqs/server'

type PageProps = {
  searchParams: Promise<SearchParams> // Correct type
}

export default async function SearchPage({ searchParams }: PageProps) {
  // Await the Promise
  const { q, page } = await searchParamsCache.parse(searchParams)

  return <Results query={q} page={page} />
}
```

**For Next.js 14 and earlier:**

```tsx
// app/search/page.tsx
import { searchParamsCache } from '@/lib/searchParams'

type PageProps = {
  searchParams: Record<string, string | string[] | undefined>
}

export default function SearchPage({ searchParams }: PageProps) {
  // No await needed in Next.js 14
  const { q, page } = searchParamsCache.parse(searchParams)

  return <Results query={q} page={page} />
}
```

**Version-agnostic pattern:**

```tsx
import type { SearchParams } from 'nuqs/server'

type PageProps = {
  searchParams: Promise<SearchParams>
}

export default async function SearchPage({ searchParams }: PageProps) {
  // Works in both Next.js 14 and 15
  const { q } = await searchParamsCache.parse(searchParams)
}
```

Reference: [Next.js 15 Migration](https://nextjs.org/docs/app/building-your-application/upgrading/version-15)
