---
title: Use useQueryStates for Related Parameters
impact: HIGH
impactDescription: gives a single typed object and one combined URLSearchParams flush
tags: state, useQueryStates, batching, atomic, related-params
---

## Use useQueryStates for Related Parameters

When multiple URL parameters are logically related (coordinates, date ranges, filter sets), prefer `useQueryStates` over a tower of `useQueryState` calls. nuqs already batches sibling setter calls within the same event-loop tick into a single URL flush, so the win isn't "fewer history entries" — it's a single typed state object, a single combined update payload, and a single returned `URLSearchParams` you can inspect for the merged result.

**Incorrect (one hook per parameter):**

```tsx
'use client'
import { useQueryState, parseAsFloat, parseAsInteger } from 'nuqs'

export default function MapView() {
  const [lat, setLat] = useQueryState('lat', parseAsFloat.withDefault(0))
  const [lng, setLng] = useQueryState('lng', parseAsFloat.withDefault(0))
  const [zoom, setZoom] = useQueryState('zoom', parseAsInteger.withDefault(10))

  const goToParis = () => {
    setLat(48.8566)
    setLng(2.3522)
    setZoom(12)
    // Three setters, three places to keep in sync.
    // Each setter resolves to its own URLSearchParams Promise — no single object holding the merged result.
  }

  return <button onClick={goToParis}>Go to Paris</button>
}
```

**Correct (one hook, one atomic update):**

```tsx
'use client'
import { useQueryStates, parseAsFloat, parseAsInteger } from 'nuqs'

export default function MapView() {
  const [coords, setCoords] = useQueryStates({
    lat: parseAsFloat.withDefault(0),
    lng: parseAsFloat.withDefault(0),
    zoom: parseAsInteger.withDefault(10)
  })

  const goToParis = async () => {
    const search = await setCoords({ lat: 48.8566, lng: 2.3522, zoom: 12 })
    // search: URLSearchParams with all three keys merged
  }

  return (
    <div>
      <p>Location: {coords.lat}, {coords.lng} (zoom: {coords.zoom})</p>
      <button onClick={goToParis}>Go to Paris</button>
    </div>
  )
}
```

**Partial updates and clearing:**

```tsx
setCoords({ zoom: 15 })                  // Update only zoom; lat/lng untouched
setCoords({ lat: 51.5074, lng: -0.1278 }) // Update lat/lng; keep zoom
setCoords(null)                           // Clear every key in the object
```

**When NOT to use this pattern:**
- Parameters belong to unrelated UI surfaces (e.g., a sidebar filter vs. an unrelated pagination control) — coupling them in one hook causes unnecessary re-renders of components that only need one key.
- Non-Next.js adapters (v2.5+) automatically scope re-renders to specific keys when you use `useQueryState`, so splitting into independent hooks can actually be faster for re-render-sensitive trees. See `perf-avoid-rerender`.

Reference: [nuqs Batching](https://nuqs.dev/docs/batching)
