---
title: Enable Debug Logging for Troubleshooting
impact: LOW-MEDIUM
impactDescription: surfaces the exact parse/serialize/URL-write step instead of guessing from silent state
tags: debug, logging, localStorage, troubleshooting, devtools
---

## Enable Debug Logging for Troubleshooting

Enable nuqs debug logs to understand state changes, URL updates, and timing. Useful for diagnosing issues with state synchronization or unexpected behavior.

**Incorrect (no visibility into nuqs operations):**

```tsx
'use client'
import { useQueryState, parseAsInteger } from 'nuqs'

export default function Counter() {
  const [count, setCount] = useQueryState('count', parseAsInteger.withDefault(0))
  // Something's not working, but no way to see what nuqs is doing
  // Have to guess and add console.logs everywhere

  return <button onClick={() => setCount(c => c + 1)}>{count}</button>
}
```

**Correct (enable debug logging):**

```javascript
// Run in browser DevTools console FIRST
localStorage.debug = 'nuqs'
// Then reload the page
// Now you see: [nuqs] useQueryState 'count' initialized with 0
// And: [nuqs] useQueryState 'count' updated to 1
```

**Disable when done:**

```javascript
// Run in browser DevTools console
delete localStorage.debug
```

**Performance timing markers:**

Debug mode also records User Timing markers visible in the Performance tab:
- `nuqs:parse` - Time to parse URL parameters
- `nuqs:serialize` - Time to serialize state to URL
- `nuqs:update` - Time for URL update

Reference: [nuqs Debugging](https://nuqs.dev/docs)
