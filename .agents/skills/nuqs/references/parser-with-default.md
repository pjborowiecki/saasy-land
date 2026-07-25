---
title: Use withDefault for Non-Nullable State
impact: CRITICAL
impactDescription: eliminates null checks throughout component tree
tags: parser, withDefault, null-safety, type-inference
---

## Use withDefault for Non-Nullable State

Without `withDefault`, query state is always nullable (`T | null`). This forces null checks everywhere the value is used. Use `withDefault` to provide a fallback value and get non-nullable types.

**Incorrect (nullable state, null checks everywhere):**

```tsx
'use client'
import { useQueryState, parseAsInteger } from 'nuqs'

export default function Counter() {
  const [count, setCount] = useQueryState('count', parseAsInteger)
  // count is number | null

  return (
    <div>
      {/* Null check required */}
      <p>Count: {count ?? 0}</p>
      {/* Null check required */}
      <button onClick={() => setCount((count ?? 0) + 1)}>
        Increment
      </button>
    </div>
  )
}
```

**Correct (non-nullable with default):**

```tsx
'use client'
import { useQueryState, parseAsInteger } from 'nuqs'

export default function Counter() {
  const [count, setCount] = useQueryState(
    'count',
    parseAsInteger.withDefault(0)
  )
  // count is number (never null)

  return (
    <div>
      <p>Count: {count}</p>
      <button onClick={() => setCount(c => c + 1)}>
        Increment
      </button>
    </div>
  )
}
```

**Benefits:**
- TypeScript infers non-nullable type
- No null coalescing needed
- Functional updates work without null checks
- Default appears in URL only when `clearOnDefault: false`

Reference: [nuqs withDefault](https://nuqs.dev/docs/parsers)
