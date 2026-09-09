import { env } from "cloudflare:workers"

import { assert, expect, it, vi } from "vite-plus/test"

import { Route } from "~/src/routes/api/index"

it("reports the Worker runtime through the API root", async () => {
  const handlers = Route.options.server?.handlers
  assert(typeof handlers === "object" && handlers.GET)
  const response = await handlers.GET({
    context: { env, passThroughOnException: () => {}, waitUntil: () => {} },
    next: vi.fn(),
    params: {},
    pathname: "/api",
    request: new Request("https://saasyland.com/api/"),
  })
  assert(response instanceof Response)
  expect(response.status).toBe(200)
  await expect(response.json()).resolves.toEqual({ runtime: "cloudflare-workers" })
})
