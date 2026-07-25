---
title: Implement eq Function for Object Parsers
impact: LOW
impactDescription: prevents unnecessary URL updates for equivalent objects
tags: advanced, eq, equality, objects, optimization
---

## Implement eq Function for Object Parsers

When creating custom parsers for objects, implement the `eq` function to define equality. Without it, nuqs uses reference equality, causing unnecessary URL updates for equivalent but different object instances.

**Incorrect (reference equality):**

```tsx
import { createParser } from 'nuqs'

interface Filters {
  minPrice: number
  maxPrice: number
}

const parseAsFilters = createParser<Filters>({
  parse(query) {
    const [min, max] = query.split('-').map(Number)
    return { minPrice: min, maxPrice: max }
  },
  serialize({ minPrice, maxPrice }) {
    return `${minPrice}-${maxPrice}`
  }
  // Missing eq - uses reference equality
})

// Problem: setting same values creates new object references
setFilters({ minPrice: 0, maxPrice: 100 })
setFilters({ minPrice: 0, maxPrice: 100 }) // Triggers URL update even though values are same
```

**Correct (value equality):**

```tsx
import { createParser } from 'nuqs'

interface Filters {
  minPrice: number
  maxPrice: number
}

const parseAsFilters = createParser<Filters>({
  parse(query) {
    const [min, max] = query.split('-').map(Number)
    return { minPrice: min, maxPrice: max }
  },
  serialize({ minPrice, maxPrice }) {
    return `${minPrice}-${maxPrice}`
  },
  eq(a, b) {
    return a.minPrice === b.minPrice && a.maxPrice === b.maxPrice
  }
})

// Now same values don't trigger unnecessary updates
setFilters({ minPrice: 0, maxPrice: 100 })
setFilters({ minPrice: 0, maxPrice: 100 }) // No URL update - values are equal
```

**For arrays:**

```tsx
const parseAsIdList = createParser<number[]>({
  parse(query) {
    return query.split(',').map(Number)
  },
  serialize(value) {
    return value.join(',')
  },
  eq(a, b) {
    return a.length === b.length && a.every((v, i) => v === b[i])
  }
})
```

**For nested objects:**

```tsx
import isEqual from 'lodash/isEqual' // or deep-equal

const parseAsConfig = createParser<Config>({
  parse: JSON.parse,
  serialize: JSON.stringify,
  eq: isEqual // Deep equality comparison
})
```

Reference: [nuqs Custom Parsers](https://nuqs.dev/docs/parsers/making-your-own)
