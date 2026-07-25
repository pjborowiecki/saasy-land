---
title: Rely on Key Isolation Outside Next.js
impact: HIGH
impactDescription: avoids unnecessary memoization on adapters that already scope re-renders per key
tags: perf, key-isolation, react-router, tanstack-router, remix, re-renders
---

## Rely on Key Isolation Outside Next.js

nuqs v2.5 added **key isolation** on every non-Next.js adapter (Plain React, React Router v5/v6/v7, Remix, TanStack Router). A `useQueryState('foo', …)` consumer there only re-renders when **`foo`** changes — unrelated URL key changes are filtered out by the adapter's subscription model. On those frameworks, the manual `memo`/leaf-component gymnastics from `perf-avoid-rerender` are usually unnecessary.

Next.js still re-renders the whole subtree on any URL change because `URLSearchParams` is delivered via a single root context. Treat Next.js as the exception.

**Incorrect (over-memoising on a key-isolated adapter):**

```tsx
// React Router v7 app
import { memo } from 'react'
import { useQueryState, parseAsString } from 'nuqs'

const Tags = memo(function Tags() {
  const [tags] = useQueryState('tags', parseAsString.withDefault(''))
  return <TagBadges tags={tags} />
})

const Sort = memo(function Sort() {
  const [sort] = useQueryState('sort', parseAsString.withDefault('desc'))
  return <SortPicker value={sort} />
})
// `memo` is redundant — Tags never re-renders when `sort` changes,
// and vice versa. Adapter already isolates by key.
```

**Correct (let the adapter do the work):**

```tsx
// React Router v7 app
import { useQueryState, parseAsString } from 'nuqs'

function Tags() {
  const [tags] = useQueryState('tags', parseAsString.withDefault(''))
  return <TagBadges tags={tags} />
}

function Sort() {
  const [sort] = useQueryState('sort', parseAsString.withDefault('desc'))
  return <SortPicker value={sort} />
}
// Tags re-renders only on `tags` changes, Sort only on `sort` — no wrappers needed.
```

**Practical rule of thumb:**

| Adapter | Re-render scope per `useQueryState` | Manual memoization usually worth it? |
|---------|-------------------------------------|--------------------------------------|
| Next.js (App + Pages) | Whole consumer subtree on **any** URL change | Yes (see `perf-avoid-rerender`) |
| Plain React | Only when subscribed key changes | No |
| React Router v5/v6/v7 | Only when subscribed key changes | No |
| Remix | Only when subscribed key changes | No |
| TanStack Router | Only when subscribed key changes | No |

**Caveat:** `useQueryStates` (the plural form) intentionally subscribes to **every** key in its object, so it re-renders whenever any of those keys change — that is its contract. If you want per-key isolation, prefer multiple `useQueryState` hooks.

**When NOT to use this pattern:**
- You're on Next.js — apply `perf-avoid-rerender` instead.
- You're using `useQueryStates` for atomic updates and accept the coarser subscription. See `state-use-query-states` for the tradeoff.

Reference: [nuqs 2.5 release notes](https://nuqs.dev/blog/nuqs-2.5)
