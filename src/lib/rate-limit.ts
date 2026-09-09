import "@tanstack/react-start/server-only"

import { env } from "cloudflare:workers"

const SINGLE_REQUEST = 1

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
    const seen = Math.trunc(Number((await env.CACHE.get(key)) ?? "0"))

    if (seen >= limit) {
      return false
    }

    await env.CACHE.put(key, String(seen + SINGLE_REQUEST), { expirationTtl: windowSeconds })

    return true
  } catch {
    return true
  }
}
