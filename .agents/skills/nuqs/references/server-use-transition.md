---
title: Integrate useTransition for Loading States
impact: HIGH
impactDescription: exposes pending state for non-shallow server fetches so the UI can show loading
tags: server, useTransition, loading, suspense, streaming
---

## Integrate useTransition for Loading States

When using `shallow: false`, integrate React's `useTransition` to track when the server is fetching new data. This enables loading indicators during URL-triggered server updates.

**Incorrect (no loading feedback):**

```tsx
'use client'
import { useQueryState, parseAsString } from 'nuqs'

export default function SearchBox() {
  const [query, setQuery] = useQueryState('q', parseAsString.withDefault('').withOptions({
    shallow: false
  }))
  // User types, waits with no feedback while server fetches

  return (
    <input
      value={query}
      onChange={e => setQuery(e.target.value)}
      placeholder="Search..."
    />
  )
}
```

**Correct (loading state):**

```tsx
'use client'
import { useTransition } from 'react'
import { useQueryState, parseAsString } from 'nuqs'

export default function SearchBox() {
  const [isLoading, startTransition] = useTransition()
  const [query, setQuery] = useQueryState('q', parseAsString.withDefault('').withOptions({
    shallow: false,
    startTransition
  }))

  return (
    <div>
      <input
        value={query}
        onChange={e => setQuery(e.target.value)}
        placeholder="Search..."
      />
      {isLoading && <span className="spinner" />}
    </div>
  )
}
```

**With disabled interaction during load:**

```tsx
'use client'
import { useTransition } from 'react'
import { useQueryStates, parseAsString, parseAsInteger } from 'nuqs'

export default function FilterPanel() {
  const [isLoading, startTransition] = useTransition()
  const [filters, setFilters] = useQueryStates(
    {
      category: parseAsString.withDefault(''),
      page: parseAsInteger.withDefault(1)
    },
    {
      shallow: false,
      startTransition
    }
  )

  return (
    <fieldset disabled={isLoading}>
      <select
        value={filters.category}
        onChange={e => setFilters({ category: e.target.value, page: 1 })}
      >
        <option value="">All</option>
        <option value="electronics">Electronics</option>
      </select>
      {isLoading && <p>Updating results...</p>}
    </fieldset>
  )
}
```

Reference: [nuqs useTransition Integration](https://nuqs.dev/docs/options)
