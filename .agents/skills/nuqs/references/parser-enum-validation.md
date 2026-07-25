---
title: Use Enum Parsers for Constrained Values
impact: CRITICAL
impactDescription: prevents invalid state from URL manipulation
tags: parser, parseAsStringEnum, parseAsStringLiteral, validation, security
---

## Use Enum Parsers for Constrained Values

When state should only accept specific values (like status, sort direction, or view mode), use enum or literal parsers. This prevents invalid values from URL tampering and provides type safety.

**Incorrect (accepts any string):**

```tsx
'use client'
import { useQueryState } from 'nuqs'

type SortOrder = 'asc' | 'desc'

export default function SortableList() {
  const [sort, setSort] = useQueryState('sort')
  // sort is string | null - accepts ANY value
  // URL: ?sort=malicious works silently

  const sortOrder = sort as SortOrder // Unsafe cast!

  return (
    <select
      value={sort ?? 'asc'}
      onChange={e => setSort(e.target.value)}
    >
      <option value="asc">Ascending</option>
      <option value="desc">Descending</option>
    </select>
  )
}
```

**Correct (validated enum):**

```tsx
'use client'
import { useQueryState, parseAsStringLiteral } from 'nuqs'

const sortOrders = ['asc', 'desc'] as const

export default function SortableList() {
  const [sort, setSort] = useQueryState(
    'sort',
    parseAsStringLiteral(sortOrders).withDefault('asc')
  )
  // sort is 'asc' | 'desc' - invalid values return null/default
  // URL: ?sort=malicious → falls back to 'asc'

  return (
    <select value={sort} onChange={e => setSort(e.target.value as typeof sort)}>
      <option value="asc">Ascending</option>
      <option value="desc">Descending</option>
    </select>
  )
}
```

**Alternative (TypeScript enum):**

```tsx
import { parseAsStringEnum } from 'nuqs'

enum Status {
  Active = 'active',
  Inactive = 'inactive',
  Pending = 'pending'
}

const [status, setStatus] = useQueryState(
  'status',
  parseAsStringEnum<Status>(Object.values(Status)).withDefault(Status.Active)
)
```

Reference: [nuqs Enum Parsers](https://nuqs.dev/docs/parsers)
