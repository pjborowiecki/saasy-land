---
title: Configure App-Wide Defaults on NuqsAdapter
impact: MEDIUM
impactDescription: avoids repeating .withOptions on every parser; enforces consistent behaviour
tags: setup, NuqsAdapter, defaultOptions, configuration, consistency
---

## Configure App-Wide Defaults on NuqsAdapter

Since nuqs v2.5, `NuqsAdapter` accepts a `defaultOptions` prop. It takes exactly the serialisable options — `shallow`, `scroll`, `clearOnDefault`, `limitUrlUpdates`, and (since v2.9.0) `history`. Setting them once on the adapter eliminates the temptation to copy-paste the same `.withOptions({ … })` chain onto every parser, and reduces the chance one component silently disagrees with the rest of the app (e.g. one missing `shallow: false` that drops a server fetch). `startTransition` is **not** a `defaultOptions` key — it's a function from `useTransition()` and can only be passed per hook call.

**Incorrect (every parser repeats the same options):**

```tsx
// Search page
const [q]    = useQueryState('q',    parseAsString.withDefault('').withOptions({ shallow: false, scroll: false }))
const [page] = useQueryState('page', parseAsInteger.withDefault(1).withOptions({ shallow: false, scroll: false }))

// Filters page
const [tag]  = useQueryState('tag',  parseAsString.withDefault('').withOptions({ shallow: false /* forgot scroll: false */ }))
// Inconsistency: filter changes now scroll to top; search changes don't.
```

**Correct (set defaults once on the adapter):**

```tsx
// app/layout.tsx
import { NuqsAdapter } from 'nuqs/adapters/next/app'

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html>
      <body>
        <NuqsAdapter
          defaultOptions={{
            shallow: false, // Every URL change re-runs the server
            scroll: false   // Never auto-scroll on URL update
          }}
        >
          {children}
        </NuqsAdapter>
      </body>
    </html>
  )
}
```

```tsx
// Anywhere in the tree — no per-parser duplication
const [q]    = useQueryState('q', parseAsString.withDefault(''))
const [page] = useQueryState('page', parseAsInteger.withDefault(1))
// Both inherit shallow: false, scroll: false from the adapter
```

**Per-hook overrides still work:**

```tsx
// A purely-local UI flag — opt out of the server round-trip just here
const [drawerOpen, setDrawerOpen] = useQueryState(
  'drawer',
  parseAsBoolean.withDefault(false).withOptions({ shallow: true })
)
```

**Precedence (low → high):** built-in defaults → adapter `defaultOptions` → parser `.withOptions(…)` → per-call `setX(value, { … })`.

**When NOT to use this pattern:**
- The app has fewer than a handful of nuqs hooks — duplicating options is fine.
- Different sections of the app legitimately want different defaults (e.g. an embedded widget vs. a full page) — split the tree into two adapters with their own `defaultOptions`.

Reference: [nuqs 2.5 release notes](https://nuqs.dev/blog/nuqs-2.5)
