---
title: Use shallow:false to Trigger Server Re-renders
impact: HIGH
impactDescription: enables server-side data refetching on URL change
tags: server, shallow, server-components, data-fetching, rsc
---

## Use shallow:false to Trigger Server Re-renders

By default, nuqs updates are client-side only (`shallow: true`). Set `shallow: false` to trigger Server Component re-renders when URL changes, enabling server-side data fetching.

**Incorrect (server data never refreshes):**

```tsx
'use client'
import { useQueryState, parseAsInteger } from 'nuqs'

export default function Pagination() {
  const [page, setPage] = useQueryState('page', parseAsInteger.withDefault(1))
  // shallow: true (default) - server doesn't see URL changes
  // Server-fetched data stays stale

  return <button onClick={() => setPage(p => p + 1)}>Next</button>
}
```

**Correct (server refetches on change):**

```tsx
'use client'
import { useQueryState, parseAsInteger } from 'nuqs'

export default function Pagination() {
  const [page, setPage] = useQueryState('page', parseAsInteger.withDefault(1).withOptions({
    shallow: false // Notify server of URL changes
  }))
  // Server Components re-render with new page value

  return <button onClick={() => setPage(p => p + 1)}>Next</button>
}
```

**With loading state using useTransition:**

```tsx
'use client'
import { useTransition } from 'react'
import { useQueryState, parseAsInteger } from 'nuqs'

export default function Pagination() {
  const [isLoading, startTransition] = useTransition()
  const [page, setPage] = useQueryState('page', parseAsInteger.withDefault(1).withOptions({
    shallow: false,
    startTransition // Shows loading during server fetch
  }))

  return (
    <div>
      {isLoading && <span>Loading...</span>}
      <button onClick={() => setPage(p => p + 1)} disabled={isLoading}>
        Next
      </button>
    </div>
  )
}
```

**When to use shallow:false:**
- Pagination with server-fetched data
- Search that triggers server queries
- Filters that affect server-rendered content
- Any state that affects Server Component output

Reference: [nuqs Shallow Option](https://nuqs.dev/docs/options)
