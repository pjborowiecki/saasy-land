---
title: Clear URL Parameters with null
impact: HIGH
impactDescription: reduces URL clutter by removing unnecessary parameters
tags: state, null, clear, url-cleanup, reset
---

## Clear URL Parameters with null

To remove a parameter from the URL, set it to `null`. Setting to empty string (`''`) or `0` keeps the parameter in the URL with that value.

**Incorrect (empty string in URL):**

```tsx
'use client'
import { useQueryState } from 'nuqs'

export default function SearchBox() {
  const [query, setQuery] = useQueryState('q')

  const clear = () => setQuery('')
  // URL: ?q=  (empty but parameter remains)

  return (
    <div>
      <input value={query ?? ''} onChange={e => setQuery(e.target.value)} />
      <button onClick={clear}>Clear</button>
    </div>
  )
}
```

**Correct (null removes parameter):**

```tsx
'use client'
import { useQueryState } from 'nuqs'

export default function SearchBox() {
  const [query, setQuery] = useQueryState('q')

  const clear = () => setQuery(null)
  // URL: / (parameter removed entirely)

  return (
    <div>
      <input
        value={query ?? ''}
        onChange={e => setQuery(e.target.value || null)}
      />
      <button onClick={clear}>Clear</button>
    </div>
  )
}
```

**Pattern: Convert empty to null on change:**

```tsx
<input
  value={query ?? ''}
  onChange={e => setQuery(e.target.value || null)}
/>
// Empty input → null → clean URL
// "search term" → "search term" → ?q=search+term
```

**With typed parsers:**

```tsx
const [count, setCount] = useQueryState('count', parseAsInteger)

// Clear the parameter
setCount(null) // URL: /

// With default, null resets to default behavior
const [page, setPage] = useQueryState('page', parseAsInteger.withDefault(1))
setPage(null) // URL: / (page defaults to 1, not shown)
```

Reference: [nuqs Documentation](https://nuqs.dev/docs)
