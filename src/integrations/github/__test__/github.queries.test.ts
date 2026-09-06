import * as workers from "cloudflare:workers"

import { QueryClient } from "@tanstack/react-query"
import { afterEach, expect, it, vi } from "vite-plus/test"

import { getStarCount, starCountQuery } from "~/src/integrations/github/github.queries"

const { env } = workers
const CACHE_KEY = "github:saasyland/saasyland.com:stars"
const ONE_HOUR_MS = 3_600_000

const captureBackgroundTasks = () => {
  const tasks: Promise<unknown>[] = []
  vi.spyOn(workers, "waitUntil").mockImplementation((task) => {
    tasks.push(task)
  })
  return tasks
}

afterEach(() => vi.restoreAllMocks())

it("reuses fresh public metadata from KV without fetching GitHub", async () => {
  await env.CACHE.put(CACHE_KEY, JSON.stringify({ count: 123, fetchedAt: Date.now() }))
  const fetch = vi.spyOn(globalThis, "fetch")

  expect(await new QueryClient().query(starCountQuery)).toBe(123)
  expect(fetch).not.toHaveBeenCalled()
})

it("persists a verified count without an expiration and reuses the TanStack Query cache", async () => {
  const now = Date.now()
  vi.spyOn(Date, "now").mockReturnValue(now)
  const fetch = vi.spyOn(globalThis, "fetch").mockResolvedValue(Response.json({ stargazers_count: 456 }))
  const put = vi.spyOn(env.CACHE, "put")
  const get = vi.spyOn(env.CACHE, "get")
  const client = new QueryClient()

  expect(await client.query(starCountQuery)).toBe(456)
  expect(await client.query(starCountQuery)).toBe(456)
  expect(fetch).toHaveBeenCalledTimes(1)
  expect(get).toHaveBeenCalledTimes(1)
  expect(put).toHaveBeenCalledWith(CACHE_KEY, JSON.stringify({ count: 456, fetchedAt: now }))
  const [request] = fetch.mock.calls
  expect(request?.[0]).toBe("https://api.github.com/repos/saasyland/saasyland.com")
  expect(request?.[1]?.headers).toEqual({
    accept: "application/vnd.github+json",
    authorization: `Basic ${btoa(`${env.AUTH_GITHUB_CLIENT_ID}:${env.AUTH_GITHUB_CLIENT_SECRET}`)}`,
    "user-agent": "saasyland.com",
  })
  expect(request?.[1]?.signal).toBeInstanceOf(AbortSignal)
})

it("returns the verified count immediately while stale data refreshes in the background", async () => {
  const now = Date.now()
  vi.spyOn(Date, "now").mockReturnValue(now)
  await env.CACHE.put(CACHE_KEY, JSON.stringify({ count: 455, fetchedAt: now - ONE_HOUR_MS }))
  const response = Promise.withResolvers<Response>()
  const fetch = vi.spyOn(globalThis, "fetch").mockReturnValue(response.promise)
  const tasks = captureBackgroundTasks()

  expect(await getStarCount()).toBe(455)
  expect(tasks).toHaveLength(1)
  response.resolve(Response.json({ stargazers_count: 456 }))
  await Promise.all(tasks)

  expect(await getStarCount()).toBe(456)
  expect(fetch).toHaveBeenCalledTimes(1)
  expect(await env.CACHE.get(CACHE_KEY, "json")).toEqual({ count: 456, fetchedAt: now })
})

it.each([
  { name: "rate limited", response: () => Promise.resolve(new Response(undefined, { status: 429 })) },
  { name: "unavailable", response: () => Promise.resolve(new Response(undefined, { status: 503 })) },
  { name: "offline", response: () => Promise.reject(new Error("offline")) },
  { name: "invalid data", response: () => Promise.resolve(Response.json({ stargazers_count: -1 })) },
])("keeps the last verified count when GitHub is $name, even days later", async ({ response }) => {
  const cached = { count: 456, fetchedAt: Date.now() - ONE_HOUR_MS * 72 }
  await env.CACHE.put(CACHE_KEY, JSON.stringify(cached))
  vi.spyOn(globalThis, "fetch").mockImplementation(response)
  const put = vi.spyOn(env.CACHE, "put")
  const tasks = captureBackgroundTasks()

  expect(await getStarCount()).toBe(456)
  await Promise.all(tasks)
  expect(await env.CACHE.get(CACHE_KEY, "json")).toEqual(cached)
  expect(put).not.toHaveBeenCalled()
})

it("refreshes counts written in the previous cache format without dropping them", async () => {
  await env.CACHE.put(CACHE_KEY, "455")
  vi.spyOn(globalThis, "fetch").mockResolvedValue(Response.json({ stargazers_count: 456 }))
  const tasks = captureBackgroundTasks()

  expect(await getStarCount()).toBe(455)
  await Promise.all(tasks)
  expect(await getStarCount()).toBe(456)
})

it.each([null, 10, {}, { stargazers_count: "wrong" }, { stargazers_count: -1 }, { stargazers_count: 1.5 }])(
  "does not cache invalid upstream data as a successful count: %j",
  async (payload) => {
    vi.spyOn(globalThis, "fetch").mockResolvedValue(Response.json(payload))
    const put = vi.spyOn(env.CACHE, "put")

    await expect(getStarCount()).rejects.toThrow()
    expect(put).not.toHaveBeenCalled()
  },
)

it("allows the query to retry a cold-cache request after GitHub recovers", async () => {
  const fetch = vi.spyOn(globalThis, "fetch").mockResolvedValueOnce(new Response(undefined, { status: 503 }))
  fetch.mockResolvedValue(Response.json({ stargazers_count: 456 }))
  const client = new QueryClient({ defaultOptions: { queries: { retry: false } } })

  await expect(client.query(starCountQuery)).rejects.toThrow("GitHub repository request failed (503)")
  expect(client.getQueryData(starCountQuery.queryKey)).toBeUndefined()
  expect(await client.query(starCountQuery)).toBe(456)
})

it("still fetches the real count when the cache cannot be read", async () => {
  vi.spyOn(env.CACHE, "get").mockRejectedValue(new Error("Cache unavailable"))
  vi.spyOn(globalThis, "fetch").mockResolvedValue(Response.json({ stargazers_count: 456 }))

  expect(await getStarCount()).toBe(456)
})

it.each([
  { cached: "invalid" },
  { cached: -1 },
  { cached: 1.5 },
  { cached: {} },
  { cached: [] },
  { cached: { count: 456, fetchedAt: "yesterday" } },
  { cached: { count: -1, fetchedAt: Date.now() } },
])("ignores invalid cached counts: $cached", async ({ cached }) => {
  await env.CACHE.put(CACHE_KEY, JSON.stringify(cached))
  vi.spyOn(globalThis, "fetch").mockResolvedValue(Response.json({ stargazers_count: 456 }))

  expect(await getStarCount()).toBe(456)
})

it("returns the live count even when writing it to cache fails", async () => {
  vi.spyOn(env.CACHE, "put").mockRejectedValue(new Error("Cache unavailable"))
  vi.spyOn(globalThis, "fetch").mockResolvedValue(Response.json({ stargazers_count: 456 }))

  expect(await getStarCount()).toBe(456)
})

it("preserves zero from GitHub and the cache", async () => {
  const fetch = vi.spyOn(globalThis, "fetch").mockResolvedValue(Response.json({ stargazers_count: 0 }))

  expect(await getStarCount()).toBe(0)
  expect(await getStarCount()).toBe(0)
  expect(fetch).toHaveBeenCalledTimes(1)
})
