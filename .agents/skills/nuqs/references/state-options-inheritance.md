---
title: Use withOptions for Parser-Level Configuration
impact: MEDIUM
impactDescription: reduces boilerplate and ensures consistent behavior
tags: state, withOptions, configuration, parsers, reusability
---

## Use withOptions for Parser-Level Configuration

Instead of passing options to every `useQueryState` call, configure options on the parser itself with `withOptions`. This ensures consistent behavior and reduces repetition.

**Incorrect (options repeated at every call site):**

```tsx
'use client'
import { useQueryState, parseAsString, throttle } from 'nuqs'

export default function SearchPage() {
  const [query, setQuery] = useQueryState(
    'q',
    parseAsString.withDefault('').withOptions({ shallow: false, limitUrlUpdates: throttle(500), history: 'push' })
  )

  const [filter, setFilter] = useQueryState(
    'filter',
    parseAsString.withDefault('').withOptions({ shallow: false, limitUrlUpdates: throttle(500), history: 'push' })
  )

  // Same option bag copy-pasted — one typo and the two keys drift apart
}
```

**Correct (parser-level options):**

```tsx
// lib/searchParams.ts
import { parseAsString, parseAsInteger, throttle } from 'nuqs'

const serverSyncOptions = {
  shallow: false,
  limitUrlUpdates: throttle(500),
  history: 'push' as const
}

export const searchParams = {
  query: parseAsString.withDefault('').withOptions(serverSyncOptions),
  filter: parseAsString.withDefault('').withOptions(serverSyncOptions),
  page: parseAsInteger.withDefault(1).withOptions(serverSyncOptions)
}

// components/SearchPage.tsx
'use client'
import { useQueryState } from 'nuqs'
import { searchParams } from '@/lib/searchParams'

export default function SearchPage() {
  const [query, setQuery] = useQueryState('q', searchParams.query)
  const [filter, setFilter] = useQueryState('filter', searchParams.filter)
  const [page, setPage] = useQueryState('page', searchParams.page)

  // All use the same options consistently
}
```

**Options can be chained:**

```tsx
parseAsInteger
  .withDefault(1)
  .withOptions({ shallow: false })
  .withOptions({ limitUrlUpdates: throttle(300) }) // Merges with previous options
```

Reference: [nuqs Options](https://nuqs.dev/docs/options)
