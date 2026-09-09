import { env, waitUntil } from "cloudflare:workers"

import { queryOptions } from "@tanstack/react-query"
import { createServerFn } from "@tanstack/react-start"
import { z } from "zod"

import { APP_GITHUB_OWNER, APP_GITHUB_REPO } from "~/src/presentation/branding"

const FETCH_TIMEOUT_MS = 3000
const MILLISECONDS_PER_SECOND = 1000
const CACHE_SECONDS = 3600
const CACHE_KEY = `github:${APP_GITHUB_OWNER}/${APP_GITHUB_REPO}:stars`

const GITHUB_QUERY_KEYS = { STARS: ["github", "stars"] } as const

const starCountSchema = z.int().nonnegative()
const cachedStarCountSchema = z.object({ count: starCountSchema, fetchedAt: z.int().nonnegative() })
const githubRepositorySchema = z.object({ stargazers_count: starCountSchema })

const readCachedStarCount = async (): Promise<z.infer<typeof cachedStarCountSchema> | undefined> => {
  try {
    const cached = await env.CACHE.get(CACHE_KEY, "json")
    // Preserve verified counts written before the cache included a refresh timestamp.
    const legacy = starCountSchema.safeParse(cached)
    if (legacy.success) {
      return { count: legacy.data, fetchedAt: 0 }
    }
    return cachedStarCountSchema.safeParse(cached).data
  } catch {
    return undefined
  }
}

const cacheStarCount = async (count: number): Promise<void> => {
  try {
    // Refresh after an hour without deleting the last verified count during an outage.
    await env.CACHE.put(CACHE_KEY, JSON.stringify({ count, fetchedAt: Date.now() }))
  } catch {
    // A failed cache write must not discard the count returned by GitHub.
  }
}

const fetchStarCount = async (): Promise<number> => {
  const credentials = btoa(`${env.AUTH_GITHUB_CLIENT_ID}:${env.AUTH_GITHUB_CLIENT_SECRET}`)
  const response = await fetch(`https://api.github.com/repos/${APP_GITHUB_OWNER}/${APP_GITHUB_REPO}`, {
    headers: {
      accept: "application/vnd.github+json",
      authorization: `Basic ${credentials}`,
      "user-agent": APP_GITHUB_REPO,
    },
    signal: AbortSignal.timeout(FETCH_TIMEOUT_MS),
  })
  if (!response.ok) {
    throw new Error(`GitHub repository request failed (${response.status})`)
  }
  const payload: unknown = await response.json()
  const { stargazers_count: count } = githubRepositorySchema.parse(payload)
  await cacheStarCount(count)
  return count
}

export const getStarCount = createServerFn({ method: "GET" }).handler(async (): Promise<number> => {
  const cached = await readCachedStarCount()
  if (cached !== undefined) {
    if (Date.now() - cached.fetchedAt >= CACHE_SECONDS * MILLISECONDS_PER_SECOND) {
      waitUntil(fetchStarCount().catch(() => {}))
    }
    return cached.count
  }
  return fetchStarCount()
})

export const starCountQuery = queryOptions({
  gcTime: CACHE_SECONDS * MILLISECONDS_PER_SECOND,
  queryFn: () => getStarCount(),
  queryKey: GITHUB_QUERY_KEYS.STARS,
  staleTime: CACHE_SECONDS * MILLISECONDS_PER_SECOND,
})
