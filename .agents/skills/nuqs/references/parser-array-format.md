---
title: Choose Correct Array Parser Format
impact: CRITICAL
impactDescription: prevents API integration failures from wrong URL format
tags: parser, parseAsArrayOf, parseAsNativeArrayOf, arrays, url-format
---

## Choose Correct Array Parser Format

nuqs offers two array formats with different URL representations. Choose based on your backend API expectations and URL readability requirements.

**Incorrect (wrong format for backend):**

```tsx
'use client'
import { useQueryState, parseAsArrayOf, parseAsString } from 'nuqs'

export default function TagFilter() {
  const [tags, setTags] = useQueryState(
    'tags',
    parseAsArrayOf(parseAsString).withDefault([])
  )
  // URL: ?tags=react,nextjs
  // But backend expects: ?tag=react&tag=nextjs
  // API receives single string "react,nextjs" instead of array!
}
```

**Correct (match backend expectations):**

```tsx
'use client'
import { useQueryState, parseAsNativeArrayOf, parseAsString } from 'nuqs'

export default function TagFilter() {
  const [tags, setTags] = useQueryState(
    'tag', // Note: singular key name
    parseAsNativeArrayOf(parseAsString).withDefault([])
  )
  // URL: ?tag=react&tag=nextjs
  // Backend correctly receives array ['react', 'nextjs']

  return (
    <div>
      Tags: {tags.join(', ')}
      <button onClick={() => setTags([...tags, 'new-tag'])}>Add</button>
    </div>
  )
}
```

**When to use each:**

| Format | URL Example | Use When | Min version |
|--------|-------------|----------|-------------|
| `parseAsArrayOf` | `?ids=1,2,3` | Compact URLs, numeric IDs, custom backends | All versions |
| `parseAsNativeArrayOf` | `?tag=a&tag=b` | Standard form encoding, PHP/Rails backends | **v2.7+** (MultiParsers) |

If you're on nuqs < 2.7, use `parseAsArrayOf` with a separator change (e.g., `.withOptions({ ... })`) or upgrade — there is no shim.

Reference: [nuqs Array Parsers](https://nuqs.dev/docs/parsers/built-in)
