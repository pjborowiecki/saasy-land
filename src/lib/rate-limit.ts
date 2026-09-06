import "@tanstack/react-start/server-only"

import { env } from "cloudflare:workers"

const FIRST_ATTEMPT = 1
const RADIX = 10
const NONE = "0"

export const withinRateLimit = async ({
  key,
  limit,
  windowSeconds,
}: {
  key: string
  limit: number
  windowSeconds: number
}): Promise<boolean> => {
  try {
    const seen = Number.parseInt((await env.CACHE.get(key)) ?? NONE, RADIX)

    if (seen >= limit) {
      return false
    }

    await env.CACHE.put(key, String(seen + FIRST_ATTEMPT), { expirationTtl: windowSeconds })

    return true
  } catch {
    return true
  }
}
