---
title: Use Setter Return Value for URL Access
impact: MEDIUM
impactDescription: enables accurate URL tracking for analytics/sharing without re-deriving the URL
tags: state, setter, return-value, URLSearchParams, analytics
---

## Use Setter Return Value for URL Access

The state setter returns a `Promise<URLSearchParams>` that resolves to the merged URL search params after the update is flushed. Use it whenever you need the resulting URL immediately (sharing, copy-to-clipboard, analytics) instead of re-deriving the URL by hand and risking drift from nuqs's own serialisation. Because it resolves to a `URLSearchParams` object, you must call `.toString()` when embedding it in a string.

**Incorrect (manually reconstructing the URL):**

```tsx
'use client'
import { useQueryState, parseAsString } from 'nuqs'

export default function ShareButton() {
  const [query, setQuery] = useQueryState('q', parseAsString.withDefault(''))

  const share = () => {
    setQuery('shared-term')
    // Manual URL construction — drifts from nuqs's encoding (clearOnDefault, urlKeys, etc.)
    const url = `${window.location.pathname}?q=shared-term`
    navigator.clipboard.writeText(url)
  }

  return <button onClick={share}>Share</button>
}
```

**Correct (use the awaited return value):**

```tsx
'use client'
import { useQueryState, parseAsString } from 'nuqs'

export default function ShareButton() {
  const [query, setQuery] = useQueryState('q', parseAsString.withDefault(''))

  const share = async () => {
    const search = await setQuery('shared-term')
    // search is URLSearchParams — call .toString() to embed in a URL.
    const url = `${window.location.origin}${window.location.pathname}?${search.toString()}`
    await navigator.clipboard.writeText(url)
  }

  return <button onClick={share}>Share</button>
}
```

**For analytics:**

```tsx
const trackSearch = async (term: string) => {
  const search = await setQuery(term)
  analytics.track('search', {
    term,
    url: `?${search.toString()}`,
    // You can also pull individual keys directly off URLSearchParams:
    canonicalQuery: search.get('q')
  })
}
```

**With `useQueryStates` — merged params come back in one object:**

```tsx
const [coords, setCoords] = useQueryStates({
  lat: parseAsFloat,
  lng: parseAsFloat
})

const shareLocation = async () => {
  const search = await setCoords({ lat: 48.8566, lng: 2.3522 })
  // search.toString(): "lat=48.8566&lng=2.3522"
}
```

**When NOT to use this pattern:**
- You only need the local in-memory value — read it from the returned state, not the setter Promise.
- You are inside Server Components — use `createSerializer` instead (see `perf-serialize-utility`).

Reference: [nuqs Batching](https://nuqs.dev/docs/batching)
