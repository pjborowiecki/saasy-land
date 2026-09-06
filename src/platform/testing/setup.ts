import { beforeEach, vi } from "vite-plus/test"

import { resetTestBindings } from "~/src/platform/testing/mocks/cloudflare"

beforeEach(resetTestBindings)

vi.mock(import("@tanstack/react-start"), async (importOriginal) => {
  const actual = await importOriginal()
  const { withTestRpc } = await import("~/src/platform/testing/lib/server-function")
  // Reflect preserves the generic factory signature across the test RPC proxy.
  return {
    ...actual,
    createServerFn: new Proxy(actual.createServerFn, {
      // oxlint-disable-next-line typescript/no-unsafe-argument
      apply: (target, thisArg, args) => withTestRpc(Reflect.apply(target, thisArg, args)),
    }),
  }
})

vi.mock(import("@tanstack/react-start/server"), async (importOriginal) => {
  const actual = await importOriginal()
  return { ...actual, getRequest: vi.fn(() => new Request("http://127.0.0.1:3000/")) }
})
