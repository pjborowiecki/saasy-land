import { createElement } from "react"
import { renderToString } from "react-dom/server"

import { RouterProvider, createMemoryHistory } from "@tanstack/react-router"
import { expect, it, vi } from "vite-plus/test"

import { getRouter } from "~/src/router"

vi.mock("~/src/routeTree.gen", async () => {
  const { createRootRoute } = await import("@tanstack/react-router")
  return { routeTree: createRootRoute({ component: () => createElement("p", undefined, "Router content") }) }
})
it("creates isolated query caches for separate requests", () => {
  const first = getRouter()
  const second = getRouter()
  expect(first.options.context.queryClient).not.toBe(second.options.context.queryClient)
})
it("renders the route through its SSR query provider", async () => {
  const router = getRouter()
  router.update({ context: router.options.context, history: createMemoryHistory({ initialEntries: ["/"] }) })
  await router.load()
  expect(renderToString(<RouterProvider router={router} />)).toContain("Router content")
})
it("rewrites locale paths through the native router configuration", () => {
  const router = getRouter()
  const input = router.options.rewrite?.input
  const output = router.options.rewrite?.output
  expect(input?.({ url: new URL("http://localhost/pl-PL/docs") })).toEqual(new URL("http://localhost/docs"))
  expect(output?.({ url: new URL("http://localhost/docs") })).toEqual(new URL("http://localhost/docs"))
})
