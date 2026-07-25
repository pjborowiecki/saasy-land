---
title: Throttle Rapid URL Updates
impact: MEDIUM
impactDescription: prevents browser history API rate limiting on rapid input
tags: perf, limitUrlUpdates, throttle, rate-limiting, slider
---

## Throttle Rapid URL Updates

Browsers rate-limit History API calls. Rapid updates (typing, sliders, dragging) can exceed this limit, causing dropped updates and console warnings. Pass `limitUrlUpdates: throttle(N)` to coalesce URL writes — local state continues to update instantly, the URL writes at most every N ms.

The legacy `throttleMs: N` option was deprecated in nuqs v2.5. It still works in v2.9 for backwards compatibility, but its JSDoc marks it deprecated and it will be removed in v3 — write new code with `limitUrlUpdates: throttle(N)` (or `debounce(N)`).

**Incorrect (every keystroke pushes to history):**

```tsx
'use client'
import { useQueryState, parseAsString } from 'nuqs'

export default function SearchBox() {
  const [query, setQuery] = useQueryState('q', parseAsString.withDefault(''))
  // Every keystroke writes to history → browser may throttle after ~100 rapid updates

  return (
    <input
      value={query}
      onChange={(e) => setQuery(e.target.value)}
    />
  )
}
```

**Correct (throttle URL updates):**

```tsx
'use client'
import { useQueryState, parseAsString, throttle } from 'nuqs'

export default function SearchBox() {
  const [query, setQuery] = useQueryState(
    'q',
    parseAsString.withDefault('').withOptions({
      limitUrlUpdates: throttle(300) // URL flushed at most every 300ms
    })
  )

  return (
    <input
      value={query}
      onChange={(e) => setQuery(e.target.value)}
    />
  )
}
```

**For sliders and drag operations (tighter window):**

```tsx
'use client'
import { useQueryState, parseAsInteger, throttle } from 'nuqs'

export default function VolumeSlider() {
  const [volume, setVolume] = useQueryState(
    'volume',
    parseAsInteger.withDefault(50).withOptions({
      limitUrlUpdates: throttle(100) // More responsive for continuous input
    })
  )

  return (
    <input
      type="range" min={0} max={100}
      value={volume}
      onChange={(e) => setVolume(Number(e.target.value))}
    />
  )
}
```

**Force an immediate (non-throttled) flush on a single call:**

```tsx
import { defaultRateLimit } from 'nuqs'

// Normal updates use the throttle window
setQuery('intermediate')

// On blur, bypass rate limiting and commit immediately
setQuery('final value', { limitUrlUpdates: defaultRateLimit })
```

**When NOT to use this pattern:**
- Search inputs that drive a server fetch (`shallow: false`) — prefer `debounce()` so the request only fires once the user stops typing. See `perf-debounce-search`.
- One-off updates (button clicks, form submits) — there's nothing to throttle.

**Note:** UI state from the hook updates synchronously regardless of `limitUrlUpdates`; only the URL write is rate-limited.

Reference: [nuqs Options](https://nuqs.dev/docs/options)
