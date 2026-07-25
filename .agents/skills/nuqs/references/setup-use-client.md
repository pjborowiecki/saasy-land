---
title: Add 'use client' Directive for Hooks
impact: CRITICAL
impactDescription: prevents build-breaking hook errors in RSC
tags: setup, use-client, server-components, client-components
---

## Add 'use client' Directive for Hooks

`useQueryState` and `useQueryStates` are React hooks that require client-side rendering. Using them in Server Components causes build errors.

**Incorrect (missing directive):**

```tsx
// app/search/page.tsx
import { useQueryState } from 'nuqs'

export default function SearchPage() {
  const [query, setQuery] = useQueryState('q')
  // Error: Hooks can only be called inside Client Components

  return <input value={query ?? ''} onChange={e => setQuery(e.target.value)} />
}
```

**Correct (client component):**

```tsx
// app/search/page.tsx
'use client'

import { useQueryState } from 'nuqs'

export default function SearchPage() {
  const [query, setQuery] = useQueryState('q')

  return <input value={query ?? ''} onChange={e => setQuery(e.target.value)} />
}
```

**Alternative (extract to client component):**

```tsx
// app/search/page.tsx (Server Component)
import SearchInput from './SearchInput'

export default function SearchPage() {
  return (
    <div>
      <h1>Search</h1>
      <SearchInput />
    </div>
  )
}

// app/search/SearchInput.tsx (Client Component)
'use client'

import { useQueryState } from 'nuqs'

export default function SearchInput() {
  const [query, setQuery] = useQueryState('q')
  return <input value={query ?? ''} onChange={e => setQuery(e.target.value)} />
}
```

**Note:** For reading search params in Server Components without hooks, use `createSearchParamsCache` from `nuqs/server`.

Reference: [nuqs Server-Side](https://nuqs.dev/docs/server-side)
