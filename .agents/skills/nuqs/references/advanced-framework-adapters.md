---
title: Use Framework-Specific Adapters
impact: LOW
impactDescription: prevents URL sync failures in non-Next.js apps
tags: advanced, adapters, remix, react-router, tanstack-router, frameworks
---

## Use Framework-Specific Adapters

nuqs works with multiple React frameworks through adapters. Use the correct adapter for your framework to ensure proper URL synchronisation. Picking the wrong adapter usually fails silently — hooks return stale values or never update the URL.

**Incorrect (Next.js adapter inside a React Router tree):**

```tsx
// src/main.tsx
import { NuqsAdapter } from 'nuqs/adapters/next/app' // Wrong runtime
import { BrowserRouter } from 'react-router-dom'

function App() {
  return (
    <BrowserRouter>
      <NuqsAdapter>
        <Routes />
      </NuqsAdapter>
    </BrowserRouter>
  )
}
```

**Correct (React Router v6 adapter):**

```tsx
// src/main.tsx
import { NuqsAdapter } from 'nuqs/adapters/react-router/v6'
import { BrowserRouter } from 'react-router-dom'

function App() {
  return (
    <BrowserRouter>
      <NuqsAdapter>
        <Routes />
      </NuqsAdapter>
    </BrowserRouter>
  )
}
```

**Available adapters (current as of nuqs v2.9):**

| Framework | Import Path | Notes |
|-----------|-------------|-------|
| Next.js App Router | `nuqs/adapters/next/app` | |
| Next.js Pages Router | `nuqs/adapters/next/pages` | |
| Next.js (unified) | `nuqs/adapters/next` | Use when an app mixes both routers |
| React Router v6 | `nuqs/adapters/react-router/v6` | |
| React Router v7 | `nuqs/adapters/react-router/v7` | |
| React Router v8 | `nuqs/adapters/react-router/v8` | Added in v2.9 |
| Remix | `nuqs/adapters/remix` | |
| TanStack Router | `nuqs/adapters/tanstack-router` | Added in v2.5 |
| Plain React (no router) | `nuqs/adapters/react` | For Vite / CRA apps with no router |
| Testing | `nuqs/adapters/testing` | See `debug-testing` |

**Deprecation:** The dedicated `react-router/v5` subpath was removed in v2.9 (v5 apps use the unversioned alias or upgrade). The unversioned `nuqs/adapters/react-router` import (which still aliases v6) is itself deprecated and slated for removal in nuqs v3 — always pin `/v6`, `/v7`, or `/v8` explicitly.

**Key isolation (v2.5+):** All non-Next.js adapters scope re-renders to the specific URL key a hook subscribes to. Next.js continues to re-render the entire subtree on any URL change because its `URLSearchParams` context is global. If fine-grained re-renders matter and you're not on Next.js, you generally don't need to memoize aggressively. See `perf-avoid-rerender`.

Reference: [nuqs Adapters](https://nuqs.dev/docs/adapters)
