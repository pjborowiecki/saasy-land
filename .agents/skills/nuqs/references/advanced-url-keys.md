---
title: Use urlKeys for Shorter URLs
impact: LOW
impactDescription: keeps shareable links compact by shortening verbose URL keys
tags: advanced, urlKeys, serializer, url-length, abbreviation
---

## Use urlKeys for Shorter URLs

Map verbose parameter names to shorter URL keys for cleaner, more shareable URLs while keeping descriptive names in code.

**Incorrect (verbose URL parameters):**

```tsx
'use client'
import { useQueryStates, parseAsFloat, parseAsInteger } from 'nuqs'

export default function MapView() {
  const [coords, setCoords] = useQueryStates({
    latitude: parseAsFloat.withDefault(0),
    longitude: parseAsFloat.withDefault(0),
    zoomLevel: parseAsInteger.withDefault(10)
  })
  // URL: ?latitude=48.8566&longitude=2.3522&zoomLevel=12
  // Long, harder to share, uses more bandwidth

  return <Map {...coords} />
}
```

**Correct (abbreviated URL keys):**

```tsx
'use client'
import { useQueryStates, parseAsFloat, parseAsInteger } from 'nuqs'

export default function MapView() {
  const [coords, setCoords] = useQueryStates(
    {
      latitude: parseAsFloat.withDefault(0),
      longitude: parseAsFloat.withDefault(0),
      zoomLevel: parseAsInteger.withDefault(10)
    },
    {
      urlKeys: {
        latitude: 'lat',
        longitude: 'lng',
        zoomLevel: 'z'
      }
    }
  )
  // URL: ?lat=48.8566&lng=2.3522&z=12
  // Shorter, cleaner URLs

  // Code still uses descriptive names
  console.log(coords.latitude, coords.longitude, coords.zoomLevel)

  return <Map {...coords} />
}
```

Reference: [nuqs urlKeys](https://nuqs.dev/docs/utilities)
