import { env } from "cloudflare:workers"

import { expect, it } from "vite-plus/test"
it("provides the Cloudflare KV cache used by public integrations", async () => {
  await env.CACHE.put("stars:test", "435")
  expect(await env.CACHE.get("stars:test")).toBe("435")
  await env.CACHE.delete("stars:test")
  expect(await env.CACHE.get("stars:test")).toBeNull()
})
