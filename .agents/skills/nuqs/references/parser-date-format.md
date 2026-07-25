---
title: Select Appropriate Date Parser
impact: CRITICAL
impactDescription: prevents timezone bugs and parsing failures
tags: parser, parseAsTimestamp, parseAsIsoDateTime, parseAsIsoDate, dates
---

## Select Appropriate Date Parser

nuqs provides three date parsers with different URL formats and precision. Choose based on your requirements for time precision and URL readability.

**Incorrect (wrong parser for use case):**

```tsx
'use client'
import { useQueryState, parseAsIsoDateTime } from 'nuqs'

export default function DateRangePicker() {
  const [startDate, setStartDate] = useQueryState('start', parseAsIsoDateTime)
  // URL: ?start=2024-01-01T00:00:00.000Z
  // Problem: User selected "Jan 1" but URL shows timezone complexity
  // Better: Use parseAsIsoDate for date-only pickers

  return (
    <input
      type="date"
      value={startDate?.toISOString().slice(0, 10) ?? ''}
      onChange={e => setStartDate(new Date(e.target.value))}
    />
  )
}
```

**Correct (match parser to use case):**

```tsx
'use client'
import { useQueryState, parseAsIsoDate, parseAsTimestamp } from 'nuqs'

export default function DateRangePicker() {
  // For date-only picker: clean URL
  const [startDate, setStartDate] = useQueryState('start', parseAsIsoDate)
  // URL: ?start=2024-01-01

  // For precise timestamps: use parseAsTimestamp
  const [lastModified, setLastModified] = useQueryState('modified', parseAsTimestamp)
  // URL: ?modified=1704067200000

  return (
    <input
      type="date"
      value={startDate?.toISOString().slice(0, 10) ?? ''}
      onChange={e => setStartDate(new Date(e.target.value))}
    />
  )
}
```

**When to use each:**

| Parser | URL Format | Use Case |
|--------|------------|----------|
| `parseAsTimestamp` | `1704067200000` | Precise timestamps, API integration |
| `parseAsIsoDateTime` | `2024-01-01T12:00:00.000Z` | Debugging, shareable URLs with time |
| `parseAsIsoDate` | `2024-01-01` | Date pickers, calendar views |

Reference: [nuqs Date Parsers](https://nuqs.dev/docs/parsers)
