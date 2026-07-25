---
title: Avoid Derived State from URL Parameters
impact: HIGH
impactDescription: prevents sync bugs and unnecessary re-renders
tags: state, derived-state, anti-pattern, single-source-of-truth
---

## Avoid Derived State from URL Parameters

Don't copy URL state into local `useState`. This creates two sources of truth that can drift out of sync. Use the URL state directly or compute derived values.

**Incorrect (duplicated state):**

```tsx
'use client'
import { useState, useEffect } from 'react'
import { useQueryState, parseAsInteger } from 'nuqs'

export default function Pagination() {
  const [urlPage] = useQueryState('page', parseAsInteger.withDefault(1))
  const [page, setPage] = useState(urlPage) // Duplicated!

  useEffect(() => {
    setPage(urlPage) // Sync attempt - can cause loops
  }, [urlPage])

  return <span>Page: {page}</span>
}
```

**Correct (single source of truth):**

```tsx
'use client'
import { useQueryState, parseAsInteger } from 'nuqs'

export default function Pagination() {
  const [page, setPage] = useQueryState('page', parseAsInteger.withDefault(1))

  return <span>Page: {page}</span>
}
```

**For derived values, use useMemo:**

```tsx
'use client'
import { useMemo } from 'react'
import { useQueryState, parseAsInteger } from 'nuqs'

export default function Pagination() {
  const [page] = useQueryState('page', parseAsInteger.withDefault(1))

  // Derived value, not duplicated state
  const isFirstPage = useMemo(() => page === 1, [page])
  const pageRange = useMemo(
    () => ({ start: (page - 1) * 10, end: page * 10 }),
    [page]
  )

  return (
    <div>
      <span>Page: {page}</span>
      {isFirstPage && <span>(First page)</span>}
    </div>
  )
}
```

**Exception: Debounced input**

```tsx
// OK to have local state for debounced input
const [query, setQuery] = useQueryState('q')
const [inputValue, setInputValue] = useState(query ?? '')

// Debounce URL updates
useEffect(() => {
  const timeout = setTimeout(() => setQuery(inputValue || null), 300)
  return () => clearTimeout(timeout)
}, [inputValue, setQuery])
```

Reference: [React Derived State](https://react.dev/learn/you-might-not-need-an-effect#updating-state-based-on-props-or-state)
