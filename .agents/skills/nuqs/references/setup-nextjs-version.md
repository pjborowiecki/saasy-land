---
title: Ensure Compatible Next.js Version
impact: CRITICAL
impactDescription: prevents cryptic runtime errors from version mismatch
tags: setup, nextjs, version, compatibility, app-router
---

## Ensure Compatible Next.js Version

`nuqs@^2` declares `next` as a peer dependency at `>=14.2.0` — the **same floor for both App and Pages routers**. There is no separate, lower minimum for the Pages Router; older tables that list `12.0.0` or `14.0.0` are wrong for v2. On Next.js below 14.2, install `nuqs@^1` instead. Using an unsupported combination surfaces as cryptic runtime errors, not a clean install failure.

**Version Requirements (nuqs v2):**

| Next.js | Support | Notes |
|---------|---------|-------|
| `< 14.2.0` | Not supported by nuqs v2 | Use `nuqs@^1` for these versions. |
| `>= 14.2.0` | App & Pages routers | Minimum for `nuqs@^2` (both routers). |
| `15.x` | App & Pages routers | `searchParams` is `Promise<SearchParams>` — must be `await`-ed. See `server-next15-async`. |
| `16.x` (`cacheComponents`) | App router | Requires **nuqs `>= 2.9.0`** to avoid stale URL reads when Server Components are cached. Older nuqs returns outdated query values on revisit. |

**Check your version:**

```bash
npm list next
# or
yarn why next
# or
pnpm why next
```

**Incorrect (outdated Next.js):**

```json
{
  "dependencies": {
    "next": "13.5.0",
    "nuqs": "^2.0.0"
  }
}
// May cause: "Cannot read property 'push' of undefined"
// Or: URL updates not reflected
```

**Correct (compatible version):**

```json
{
  "dependencies": {
    "next": "14.2.0",
    "nuqs": "^2.0.0"
  }
}
```

**Upgrade command:**

```bash
npm install next@latest
# or
yarn add next@latest
# or
pnpm add next@latest
```

**Common symptoms of version mismatch:**
- `useQueryState` returns undefined
- URL doesn't update on state change
- Hydration mismatches
- `TypeError: Cannot read property 'push' of undefined`

Reference: [nuqs Installation](https://nuqs.dev/docs/installation)
