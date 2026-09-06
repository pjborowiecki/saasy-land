import type * as ReactStart from "@tanstack/react-start"
import { afterEach, expect, it, vi } from "vite-plus/test"

import { deLocalizeUrl, getCurrentLocale, localizeUrl } from "~/src/integrations/use-intl/i18n.utils"

import { getCookie } from "~/src/lib/cookie"

vi.mock("@tanstack/react-start", async (importOriginal) => ({
  ...(await importOriginal<typeof ReactStart>()),
  createIsomorphicFn: () => ({ server: (_server: unknown) => ({ client: <TFunction>(client: TFunction) => client }) }),
}))
afterEach(() => vi.unstubAllGlobals())
it.each([
  ["/", "en-US"],
  ["/pl-PL/docs", "pl-PL"],
])("resolves the browser locale at %s", (pathname, locale) => {
  vi.stubGlobal("location", { pathname })
  expect(getCurrentLocale()).toBe(locale)
})
it("rewrites only URL paths and preserves search and fragments", () => {
  vi.stubGlobal("location", { pathname: "/pl-PL/docs" })
  const original = new URL("https://example.com/docs?q=one#heading")
  expect(localizeUrl(original).href).toBe("https://example.com/pl-PL/docs?q=one#heading")
  expect(original.pathname).toBe("/docs")
  expect(deLocalizeUrl(new URL("https://example.com/pl-PL/docs?q=one#heading")).href).toBe(original.href)
})
it("reads the browser cookie", () => {
  document.cookie = "example=value; path=/"
  expect(getCookie("example")).toBe("value")
})
