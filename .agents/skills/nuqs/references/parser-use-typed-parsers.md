---
title: Use Typed Parsers for Non-String Values
impact: CRITICAL
impactDescription: prevents runtime type errors and hydration mismatches
tags: parser, type-safety, parseAsInteger, parseAsFloat, parseAsBoolean
---

## Use Typed Parsers for Non-String Values

URL query parameters are always strings. Without typed parsers, you'll get string values where you expect numbers or booleans, causing type errors and incorrect comparisons.

**Incorrect (string instead of number):**

```tsx
'use client'
import { useQueryState } from 'nuqs'

export default function Pagination() {
  const [page, setPage] = useQueryState('page')
  // page is string | null, not number
  // page + 1 = "11" not 2 when page is "1"

  return (
    <button onClick={() => setPage(String(Number(page) + 1))}>
      Next Page
    </button>
  )
}
```

**Correct (typed parser):**

```tsx
'use client'
import { useQueryState, parseAsInteger } from 'nuqs'

export default function Pagination() {
  const [page, setPage] = useQueryState('page', parseAsInteger)
  // page is number | null
  // Arithmetic works correctly

  return (
    <button onClick={() => setPage((p) => (p ?? 0) + 1)}>
      Next Page
    </button>
  )
}
```

**Available parsers:**
- `parseAsInteger` - integers
- `parseAsFloat` - decimal numbers
- `parseAsBoolean` - true/false
- `parseAsTimestamp` - Date from milliseconds
- `parseAsIsoDateTime` - Date from ISO string
- `parseAsJson<T>()` - JSON objects

Reference: [nuqs Parsers Documentation](https://nuqs.dev/docs/parsers)
