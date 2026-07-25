---
title: Use processUrlSearchParams for Canonical URL Shape
impact: LOW-MEDIUM
impactDescription: enables stable URL ordering for SEO and cache hit-rate
tags: advanced, processUrlSearchParams, seo, canonical-url, createSerializer
---

## Use processUrlSearchParams for Canonical URL Shape

nuqs v2.6 added `processUrlSearchParams`, a middleware that transforms the `URLSearchParams` object **just before** it is written to the URL (when passed as an `NuqsAdapter` prop) or **just before** the URL is serialised (when passed to `createSerializer`). The most common use is to canonicalise key ordering — without it, `?b=2&a=1` and `?a=1&b=2` are two different cache keys for the same logical query, hurting SEO and CDN hit-rate.

**Incorrect (key order leaks from React render order):**

```tsx
// User toggles filters in different orders → different URLs for the same query
// /search?tag=react&sort=desc
// /search?sort=desc&tag=react
// Both render the same results, but each is a distinct canonical URL for Google.
```

**Correct (sort keys via adapter middleware):**

```tsx
// app/layout.tsx
import { NuqsAdapter } from 'nuqs/adapters/next/app'

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html>
      <body>
        <NuqsAdapter
          processUrlSearchParams={(params) => {
            // Sort keys alphabetically before each write
            params.sort()
            return params
          }}
        >
          {children}
        </NuqsAdapter>
      </body>
    </html>
  )
}
```

**For SEO canonical URLs in `generateMetadata` — same hook on `createSerializer`:**

```tsx
// lib/searchParams.ts
import { createSerializer, parseAsString, parseAsInteger } from 'nuqs/server'

export const searchParamsMap = {
  q: parseAsString.withDefault(''),
  page: parseAsInteger.withDefault(1)
}

export const serializeSearch = createSerializer(searchParamsMap, {
  processUrlSearchParams(params) {
    params.sort()
    return params
  }
})

// app/search/page.tsx
import type { Metadata } from 'next'
import { serializeSearch } from '@/lib/searchParams'

export async function generateMetadata({ searchParams }): Promise<Metadata> {
  const params = await searchParams
  return {
    alternates: {
      canonical: serializeSearch('/search', params)
    }
  }
}
```

**Other uses:**
- Stripping internal tracking params (`utm_*`) before write.
- Coercing booleans to a stable string form (`true` vs. `1`).
- Removing empty values that didn't get caught by `clearOnDefault` for legacy reasons.

**When NOT to use this pattern:**
- Single-page app with no SEO concerns — the indirection costs more than the wobble.
- You need to drop keys that affect server-side parsing — strip them on the server (in `createSearchParamsCache`/`createLoader`) instead, where the parser map is the source of truth.

Reference: [nuqs Options](https://nuqs.dev/docs/options)
