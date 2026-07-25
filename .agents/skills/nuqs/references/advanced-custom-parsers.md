---
title: Create Custom Parsers for Complex Types
impact: LOW
impactDescription: prevents runtime errors from string coercion
tags: advanced, createParser, custom, serialize, parse
---

## Create Custom Parsers for Complex Types

When built-in parsers don't fit your needs, create custom parsers with `createParser`. Define `parse`, `serialize`, and optionally `eq` for equality checking.

**Incorrect (manual parsing in component):**

```tsx
'use client'
import { useQueryState } from 'nuqs'

interface SortState {
  id: string
  desc: boolean
}

export default function SortableTable() {
  const [sortRaw, setSortRaw] = useQueryState('sort')
  // Manual parsing scattered across component
  const sort: SortState = sortRaw
    ? { id: sortRaw.split(':')[0], desc: sortRaw.split(':')[1] === 'desc' }
    : { id: 'name', desc: false }

  const handleSort = (id: string) => {
    // Manual serialization
    setSortRaw(`${id}:${sort.id === id && !sort.desc ? 'desc' : 'asc'}`)
  }
}
```

**Correct (custom parser):**

```tsx
'use client'
import { useQueryState, createParser } from 'nuqs'

interface SortState {
  id: string
  desc: boolean
}

const parseAsSort = createParser<SortState>({
  parse(query) {
    const [id = '', direction = ''] = query.split(':')
    return { id, desc: direction === 'desc' }
  },
  serialize(value) {
    return `${value.id}:${value.desc ? 'desc' : 'asc'}`
  },
  eq(a, b) {
    return a.id === b.id && a.desc === b.desc
  }
})

export default function SortableTable() {
  const [sort, setSort] = useQueryState(
    'sort',
    parseAsSort.withDefault({ id: 'name', desc: false })
  )
  // Type-safe, reusable, with proper equality checking
}
```

**Typing parser-returning helpers (v2.7+):**

If you write a function that returns a custom parser (e.g. for a factory), type the return as `SingleParserBuilder<T>`. The older `ParserBuilder<T>` symbol is deprecated and will be removed in v3.

```tsx
import { createParser, type SingleParserBuilder } from 'nuqs'

export function parseAsTuple<A, B>(
  a: SingleParserBuilder<A>,
  b: SingleParserBuilder<B>
): SingleParserBuilder<[A, B]> {
  return createParser<[A, B]>({
    parse(query) {
      const [left, right] = query.split('|')
      const A = a.parse(left ?? '')
      const B = b.parse(right ?? '')
      return A === null || B === null ? null : [A, B]
    },
    serialize([A, B]) {
      return `${a.serialize(A)}|${b.serialize(B)}`
    }
  })
}
```

**For object/JSON-shaped values:** prefer `parseAsJson` with a Standard Schema (Zod, Valibot, ArkType, Effect Schema) over a hand-rolled `createParser` — see `parser-json-validation` and `state-standard-schema`.

Reference: [nuqs Custom Parsers](https://nuqs.dev/docs/parsers/making-your-own)
