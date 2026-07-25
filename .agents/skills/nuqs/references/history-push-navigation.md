---
title: Choose the Right history Mode (push vs replace)
impact: MEDIUM
impactDescription: back button behaves as users expect for navigation vs ephemeral state
tags: history, push, replace, navigation, back-button, ux
---

## Choose the Right history Mode (push vs replace)

`history: 'replace'` is the default: state updates rewrite the current history entry, so the back button never walks through intermediate values. Reach for `history: 'push'` only when a state change *is* navigation the user should be able to undo (pagination, tabs, modal state). Getting this backwards produces two opposite bugs — a back button that leaves the site, or one that is unusable.

**Use `history: 'push'` for navigation-like state:**

```tsx
'use client'
import { useQueryState, parseAsInteger } from 'nuqs'

export default function Pagination() {
  const [page, setPage] = useQueryState(
    'page',
    parseAsInteger.withDefault(1).withOptions({ history: 'push' })
  )
  // Page 1 → 2 → 3, then Back returns to page 2 (not off-site)

  return (
    <nav>
      <button onClick={() => setPage(p => p - 1)}>Previous</button>
      <span>Page {page}</span>
      <button onClick={() => setPage(p => p + 1)}>Next</button>
    </nav>
  )
}
```

Typical `push` cases: pagination, tab selection, modal open/close, step-by-step wizards, filter-panel expansion.

**Keep the default `replace` for ephemeral state:**

```tsx
'use client'
import { useQueryState, parseAsString } from 'nuqs'

export default function SearchBox() {
  // No withOptions — replace is the default
  const [query, setQuery] = useQueryState('q', parseAsString.withDefault(''))
  // Typing "react" does NOT create entries r, re, rea, reac, react

  return <input value={query} onChange={e => setQuery(e.target.value)} placeholder="Search…" />
}
```

Using `history: 'push'` here would push one entry per keystroke and make the back button useless. Typical `replace` cases: search input text, slider/range values, real-time filters, sort order — any rapidly-changing state.

**Mix modes on a per-call basis when the same key does both:**

```tsx
const [page, setPage] = useQueryState(
  'page',
  parseAsInteger.withDefault(1).withOptions({ history: 'push' })
)

setPage(5)                          // navigation → pushes
setPage(1, { history: 'replace' })  // "reset to first page" shouldn't spam Back
```

The mirror pattern also works: keep the parser on `replace`, mirror the input in local `useState` while typing, and `setQuery(input, { history: 'push' })` only on explicit submit.

Reference: [nuqs History Option](https://nuqs.dev/docs/options)
