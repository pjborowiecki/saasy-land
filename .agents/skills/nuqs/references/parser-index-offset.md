---
title: Use parseAsIndex for 1-Based URL Display
impact: HIGH
impactDescription: eliminates off-by-one errors between URL and code
tags: parser, parseAsIndex, pagination, zero-indexed, one-indexed
---

## Use parseAsIndex for 1-Based URL Display

Arrays are 0-indexed in JavaScript, but users expect 1-indexed URLs (page 1, item 1). `parseAsIndex` automatically converts between them.

**Incorrect (manual conversion):**

```tsx
'use client'
import { useQueryState, parseAsInteger } from 'nuqs'

export default function Pagination() {
  const [page, setPage] = useQueryState('page', parseAsInteger.withDefault(1))
  // URL: ?page=1
  // Array index: need page - 1 everywhere

  const items = ['a', 'b', 'c', 'd', 'e']
  const currentItem = items[page - 1] // Manual conversion

  return (
    <div>
      <p>Page {page}: {currentItem}</p>
      <button onClick={() => setPage(p => p + 1)}>Next</button>
    </div>
  )
}
```

**Correct (automatic conversion):**

```tsx
'use client'
import { useQueryState, parseAsIndex } from 'nuqs'

export default function Pagination() {
  const [pageIndex, setPageIndex] = useQueryState(
    'page',
    parseAsIndex.withDefault(0)
  )
  // URL: ?page=1 (user-friendly, 1-indexed)
  // State: 0 (code-friendly, 0-indexed)

  const items = ['a', 'b', 'c', 'd', 'e']
  const currentItem = items[pageIndex] // Direct array access

  return (
    <div>
      <p>Page {pageIndex + 1}: {currentItem}</p>
      <button onClick={() => setPageIndex(i => i + 1)}>Next</button>
    </div>
  )
}
```

**How it works:**
- URL `?page=1` → State `0`
- URL `?page=5` → State `4`
- State `0` → URL `?page=1`
- State `4` → URL `?page=5`

**Benefits:**
- No off-by-one bugs
- Array indices work directly
- URLs are human-friendly

Reference: [nuqs parseAsIndex](https://nuqs.dev/docs/parsers)
