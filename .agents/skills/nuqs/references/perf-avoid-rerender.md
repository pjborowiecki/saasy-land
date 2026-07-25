---
title: Memoize Components Using URL State
impact: MEDIUM
impactDescription: prevents unnecessary re-renders on URL changes (Next.js especially)
tags: perf, memo, re-renders, key-isolation, react
---

## Memoize Components Using URL State

When URL state changes, components subscribed to that state re-render. On Next.js, every `useQueryState`/`useQueryStates` consumer in the subtree re-renders on **any** URL change because `URLSearchParams` is provided through a single context. Use `React.memo` and confine hook usage to leaf components to avoid cascading re-renders.

On non-Next.js adapters (React SPA, React Router, Remix, TanStack Router), nuqs v2.5 added **key isolation**: a hook only re-renders when its specific key changes. The memoization advice below is still useful but far less critical on those frameworks — see `perf-key-isolation`.

**Incorrect (entire page re-renders on every Next.js URL change):**

```tsx
'use client'
import { useQueryState, parseAsString } from 'nuqs'

export default function SearchPage() {
  const [query, setQuery] = useQueryState('q', parseAsString.withDefault(''))

  return (
    <div>
      <SearchInput query={query} setQuery={setQuery} />
      <ExpensiveSidebar /> {/* Re-renders on every query change */}
      <ResultsList query={query} />
    </div>
  )
}

function ExpensiveSidebar() {
  // Heavy computation that doesn't need query
  return <aside>…</aside>
}
```

**Correct (memoize unrelated subtrees):**

```tsx
'use client'
import { memo } from 'react'
import { useQueryState, parseAsString } from 'nuqs'

export default function SearchPage() {
  const [query, setQuery] = useQueryState('q', parseAsString.withDefault(''))

  return (
    <div>
      <SearchInput query={query} setQuery={setQuery} />
      <ExpensiveSidebar /> {/* Memoized — bypasses re-render when query changes */}
      <ResultsList query={query} />
    </div>
  )
}

const ExpensiveSidebar = memo(function ExpensiveSidebar() {
  return <aside>…</aside>
})
```

**Better (hoist the hook into a leaf — works on all adapters):**

```tsx
'use client'
import { useQueryState, parseAsString } from 'nuqs'

function SearchSection() {
  const [query, setQuery] = useQueryState('q', parseAsString.withDefault(''))

  return (
    <>
      <SearchInput query={query} setQuery={setQuery} />
      <ResultsList query={query} />
    </>
  )
}

export default function SearchPage() {
  return (
    <div>
      <SearchSection />        {/* Only this subtree re-renders on URL change */}
      <ExpensiveSidebar />     {/* Not affected */}
    </div>
  )
}
```

**When NOT to use this pattern:**
- Non-Next.js adapters where the consumer is already a leaf — key isolation makes memoization unnecessary noise.

Reference: [React memo](https://react.dev/reference/react/memo)
