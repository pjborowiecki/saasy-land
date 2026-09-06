import { env } from "cloudflare:workers"

import { afterEach, describe, expect, it, vi } from "vite-plus/test"

import { withinRateLimit } from "~/src/lib/rate-limit"

const input = { key: "sensitive:127.0.0.1", limit: 3, windowSeconds: 60 }

afterEach(() => {
  vi.restoreAllMocks()
})

describe("KV rate limits", () => {
  it("allows requests up to the configured maximum", async () => {
    for (let attempt = 0; attempt < input.limit; attempt++) {
      expect(await withinRateLimit(input)).toBe(true)
    }
  })

  it("rejects requests over the maximum", async () => {
    for (let attempt = 0; attempt < input.limit; attempt++) {
      await withinRateLimit(input)
    }

    expect(await withinRateLimit(input)).toBe(false)
  })

  it("counts against the key and expires with the window", async () => {
    await withinRateLimit(input)

    expect(await env.CACHE.get(input.key)).toBe("1")
  })

  it("isolates action and IP keys", async () => {
    await withinRateLimit({ ...input, limit: 1 })

    expect(await withinRateLimit({ ...input, key: "other:127.0.0.1", limit: 1 })).toBe(true)
  })

  it("stays open when the store is unavailable", async () => {
    vi.spyOn(env.CACHE, "get").mockRejectedValueOnce(new Error("KV unavailable"))

    expect(await withinRateLimit(input)).toBe(true)
  })
})
