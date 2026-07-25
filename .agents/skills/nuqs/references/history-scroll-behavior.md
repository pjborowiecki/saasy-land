---
title: Control Scroll Behavior on URL Changes
impact: MEDIUM
impactDescription: prevents jarring scroll jumps on state changes
tags: history, scroll, ux, navigation, viewport
---

## Control Scroll Behavior on URL Changes

By default, nuqs doesn't scroll on URL changes. Use the `scroll` option to control whether state changes scroll to the top of the page.

**Incorrect (unwanted scroll on filter change):**

```tsx
'use client'
import { useQueryState, parseAsString } from 'nuqs'

export default function FilterPanel() {
  const [filter, setFilter] = useQueryState('filter', parseAsString.withDefault('').withOptions({
    scroll: true // Bad for filters - user loses their place!
  }))

  return (
    <select value={filter} onChange={e => setFilter(e.target.value)}>
      <option value="">All</option>
      <option value="active">Active</option>
    </select>
  )
}
```

**Correct (no scroll for filters, scroll for pagination):**

```tsx
'use client'
import { useQueryState, parseAsString, parseAsInteger } from 'nuqs'

export default function SearchPage() {
  // No scroll for filters - user stays in place
  const [filter, setFilter] = useQueryState('filter', parseAsString.withDefault(''))

  // Scroll for pagination - user sees new content from top
  const [page, setPage] = useQueryState('page', parseAsInteger.withDefault(1).withOptions({
    scroll: true,
    history: 'push'
  }))

  return (
    <div>
      <select value={filter} onChange={e => setFilter(e.target.value)}>
        <option value="">All</option>
        <option value="active">Active</option>
      </select>
      <button onClick={() => setPage(p => p + 1)}>Next Page</button>
    </div>
  )
}
```

Reference: [nuqs Scroll Option](https://nuqs.dev/docs/options)
