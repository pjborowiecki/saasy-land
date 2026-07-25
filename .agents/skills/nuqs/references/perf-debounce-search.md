---
title: Debounce Search Input Before URL Update
impact: HIGH
impactDescription: reduces server requests during typing from N per keystroke to 1 per pause
tags: perf, limitUrlUpdates, debounce, search, server-load
---

## Debounce Search Input Before URL Update

For search inputs that drive a server fetch (`shallow: false`), debounce the URL write so the server only re-renders once the user stops typing. Since nuqs v2.5, debounce is built in — pass `limitUrlUpdates: debounce(N)` instead of hand-rolling a `setTimeout` dance with a parallel local-state mirror.

**Incorrect (a server request per keystroke):**

```tsx
'use client'
import { useQueryState, parseAsString } from 'nuqs'

export default function SearchBox() {
  const [query, setQuery] = useQueryState(
    'q',
    parseAsString.withDefault('').withOptions({
      shallow: false // Every keystroke triggers a server re-render
    })
  )

  return <input value={query} onChange={(e) => setQuery(e.target.value)} />
}
```

**Correct (built-in debounce — one request per pause):**

```tsx
'use client'
import { useQueryState, parseAsString, debounce } from 'nuqs'
import { useTransition } from 'react'

export default function SearchBox() {
  const [isLoading, startTransition] = useTransition()
  const [query, setQuery] = useQueryState(
    'q',
    parseAsString.withDefault('').withOptions({
      shallow: false,
      startTransition,
      limitUrlUpdates: debounce(300) // Server request fires 300ms after last keystroke
    })
  )

  return (
    <>
      <input value={query} onChange={(e) => setQuery(e.target.value)} />
      {isLoading && <span>Searching…</span>}
    </>
  )
}
```

**Why this beats the manual `setTimeout` pattern:**
- One source of truth — `query` is both the displayed value and the in-flight value; no parallel `useState` mirror.
- The Promise returned by the setter still resolves to the merged `URLSearchParams` after the debounce fires, so analytics/share flows keep working.
- nuqs v2.6 emits a warning if you combine `shallow: true` with debounce — `shallow: true` already keeps the URL local, so debouncing it is almost always a bug. Honour the warning.

**Alternative (no URL-driven fetch — useDeferredValue is fine):**

When the search is purely client-side (`shallow: true`, the default), React's `useDeferredValue` keeps the input responsive without touching nuqs options:

```tsx
'use client'
import { useDeferredValue } from 'react'
import { useQueryState, parseAsString } from 'nuqs'

export default function ClientSearch() {
  const [query, setQuery] = useQueryState('q', parseAsString.withDefault(''))
  const deferredQuery = useDeferredValue(query)

  return (
    <>
      <input value={query} onChange={(e) => setQuery(e.target.value)} />
      <Results query={deferredQuery} />
    </>
  )
}
```

**When NOT to use this pattern:**
- The setter only fires on submit/blur — there's nothing to debounce.
- You want to rate-limit continuous input (slider drags, scrub bars) — `throttle()` keeps intermediate values; `debounce()` discards them. See `perf-throttle-updates`.

Reference: [nuqs Options](https://nuqs.dev/docs/options)
