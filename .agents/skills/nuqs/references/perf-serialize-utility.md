---
title: Use createSerializer for Link URLs
impact: MEDIUM
impactDescription: enables SSR-compatible URL generation without hooks
tags: perf, createSerializer, links, navigation, ssr
---

## Use createSerializer for Link URLs

When generating URLs for links or navigation without needing state, use `createSerializer`. This avoids unnecessary hook usage and works in Server Components.

**Incorrect (hook for URL generation only):**

```tsx
'use client'
import { useQueryState, parseAsInteger } from 'nuqs'

export default function PaginationLinks({ totalPages }: { totalPages: number }) {
  const [page] = useQueryState('page', parseAsInteger.withDefault(1))

  // Using state just to generate URLs
  return (
    <nav>
      {Array.from({ length: totalPages }, (_, i) => (
        <a key={i} href={`?page=${i + 1}`}>
          {i + 1}
        </a>
      ))}
    </nav>
  )
}
```

**Correct (serializer utility):**

```tsx
// lib/searchParams.ts
import { createSerializer, parseAsInteger, parseAsString } from 'nuqs/server'

export const searchParams = {
  q: parseAsString,
  page: parseAsInteger.withDefault(1)
}

export const serialize = createSerializer(searchParams)

// components/PaginationLinks.tsx (can be Server Component)
import { serialize } from '@/lib/searchParams'

export default function PaginationLinks({ totalPages }: { totalPages: number }) {
  return (
    <nav>
      {Array.from({ length: totalPages }, (_, i) => (
        <a key={i} href={`?${serialize({ page: i + 1 })}`}>
          {i + 1}
        </a>
      ))}
    </nav>
  )
}
```

**Building on existing URL:**

```tsx
import { serialize } from '@/lib/searchParams'

// Preserve existing params, change page
const currentParams = { q: 'react', page: 1 }
const nextPageUrl = `?${serialize({ ...currentParams, page: 2 })}`
// Result: ?q=react&page=2
```

**With base URL:**

```tsx
const url = serialize('/search', { q: 'react', page: 1 })
// Result: /search?q=react&page=1
```

Reference: [nuqs createSerializer](https://nuqs.dev/docs/utilities)
