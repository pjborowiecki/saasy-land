---
title: Use clearOnDefault for Clean URLs
impact: MEDIUM
impactDescription: reduces URL length by 20-50% for default values
tags: perf, clearOnDefault, url-cleanup, defaults, seo
---

## Use clearOnDefault for Clean URLs

By default, nuqs removes parameters from the URL when they match the default value. This keeps URLs clean. Set `clearOnDefault: false` only when you need the parameter always visible.

**Incorrect (default always shown in URL):**

```tsx
'use client'
import { useQueryState, parseAsInteger } from 'nuqs'

export default function Pagination() {
  const [page, setPage] = useQueryState('page', parseAsInteger.withDefault(1).withOptions({
    clearOnDefault: false // Unnecessary!
  }))
  // URL always shows ?page=1 even on first page
  // Clutters shareable URLs, hurts SEO

  return <button onClick={() => setPage(1)}>First</button>
}
```

**Correct (clean URLs by default):**

```tsx
'use client'
import { useQueryState, parseAsInteger } from 'nuqs'

export default function Pagination() {
  const [page, setPage] = useQueryState('page', parseAsInteger.withDefault(1))
  // clearOnDefault: true (default)
  // page=1: URL is /search (clean)
  // page=2: URL is /search?page=2

  return (
    <div>
      <button onClick={() => setPage(1)}>First</button>
      <button onClick={() => setPage(p => p + 1)}>Next</button>
    </div>
  )
}
```

**When clearOnDefault: false is appropriate:**
- Analytics tracking requires all parameters
- API expects explicit parameter even for default
- Debugging where you need to see all state

Reference: [nuqs clearOnDefault](https://nuqs.dev/docs/options)
