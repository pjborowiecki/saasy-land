import { env } from "cloudflare:workers"

import { afterEach, beforeEach, expect, it, vi } from "vite-plus/test"

import { I18N } from "~/src/integrations/use-intl/i18n.config"

import worker, { type RequestContext } from "~/src/server"

const fetchHandler = vi.hoisted(() => vi.fn<(request: Request, options: { context: RequestContext }) => Promise<Response>>())
vi.mock("@tanstack/react-start/server-entry", () => ({ default: { fetch: fetchHandler } }))
const context = { passThroughOnException: vi.fn(), waitUntil: vi.fn() }
const rewriteHandlers = vi.fn<(selector: string, handlers: HTMLRewriterElementContentHandlers) => void>()
const transformAsset = vi.fn<(asset: Response) => Response>()

class TestHTMLRewriter {
  on(selector: string, handlers: HTMLRewriterElementContentHandlers): this {
    rewriteHandlers(selector, handlers)
    return this
  }

  transform(asset: Response): Response {
    return transformAsset(asset)
  }
}

const expectPricingAttribute = async (): Promise<void> => {
  const handlers = rewriteHandlers.mock.lastCall?.[1]
  const setAttribute = vi.fn()
  expect(rewriteHandlers.mock.lastCall?.[0]).toBe("html")
  if (!handlers?.element) {
    throw new Error("The Worker did not register an HTML element handler")
  }
  await Reflect.apply(handlers.element.bind(handlers), handlers, [{ setAttribute }])
  expect(setAttribute).toHaveBeenCalledExactlyOnceWith("data-ppp", "70")
}

beforeEach(() => {
  fetchHandler.mockReset()
  fetchHandler.mockResolvedValue(new Response("rendered", { headers: { "Set-Cookie": "session=kept" } }))
  rewriteHandlers.mockReset()
  transformAsset.mockReset()
  vi.stubGlobal("HTMLRewriter", TestHTMLRewriter)
})
afterEach(() => {
  vi.restoreAllMocks()
  vi.unstubAllGlobals()
})
it("canonicalizes locale aliases before rendering", async () => {
  const response = await worker.fetch(new Request("http://localhost/pl/docs?search=one"), env, context)
  expect(response.status).toBe(308)
  expect(response.headers.get("location")).toBe("http://localhost/pl-PL/docs?search=one")
  expect(fetchHandler).not.toHaveBeenCalled()
})
it("preserves the response and forwards Worker execution context", async () => {
  const request = new Request("http://localhost/")
  const response = await worker.fetch(request, env, context)
  expect(await response.text()).toBe("rendered")
  const forwarded = fetchHandler.mock.calls[0]?.[1].context
  expect(forwarded?.env).toBe(env)
  forwarded?.waitUntil(Promise.resolve())
  forwarded?.passThroughOnException()
  expect(context.waitUntil).toHaveBeenCalled()
  expect(context.passThroughOnException).toHaveBeenCalled()
})
it("sets the document locale without discarding authentication cookies", async () => {
  const response = await worker.fetch(new Request("http://localhost/pl-PL/docs"), env, context)
  expect(response.headers.get("set-cookie")).toContain(`${I18N.COOKIE_NAME}=pl-PL`)
  expect(response.headers.get("set-cookie")).toContain("session=kept")
  expect(await response.text()).toBe("rendered")
})
it("leaves API requests and their cookies to the handler", async () => {
  const response = await worker.fetch(
    new Request("http://localhost/api/auth/session", { headers: { cookie: `${I18N.COOKIE_NAME}=pl-PL` } }),
    env,
    context,
  )
  expect(response.headers.get("set-cookie")).toBe("session=kept")
})

it.each([
  ["/@id/virtual:tanstack-start-dev-client-entry", "script", "application/javascript"],
  ["/src/presentation/styles/globals.css", "style", "text/css"],
  ["/@tanstack-start/styles.css?routes=__root__", "style", "text/css"],
])("serves %s without resetting the visitor's locale cookie", async (pathname, destination, contentType) => {
  vi.spyOn(env.ASSETS, "fetch").mockResolvedValueOnce(new Response("asset contents", { headers: { "Content-Type": contentType } }))
  const response = await worker.fetch(
    new Request(`http://localhost${pathname}`, {
      headers: { accept: "*/*", cookie: `${I18N.COOKIE_NAME}=pl-PL`, "sec-fetch-dest": destination },
    }),
    env,
    context,
  )

  expect(response.headers.get("set-cookie")).toBeNull()
  expect(response.headers.get("content-type")).toBe(contentType)
  expect(await response.text()).toBe("asset contents")
  expect(fetchHandler).not.toHaveBeenCalled()
})

it("serves prerendered HTML through the locale middleware without rerendering", async () => {
  const assets = vi.spyOn(env.ASSETS, "fetch").mockResolvedValueOnce(new Response("static Polish page"))
  const response = await worker.fetch(new Request("http://localhost/pl-PL/docs"), env, context)
  expect(await response.text()).toBe("static Polish page")
  expect(response.headers.get("set-cookie")).toContain(`${I18N.COOKIE_NAME}=pl-PL`)
  expect(fetchHandler).not.toHaveBeenCalled()
  assets.mockRestore()
})
it.each(["HEAD", "POST"])("preserves %s requests when no prerendered document applies", async (method) => {
  const response = await worker.fetch(new Request("http://localhost/docs", { method }), env, context)
  expect(await response.text()).toBe("rendered")
  expect(fetchHandler).toHaveBeenCalledOnce()
})

it("sets the country pricing band on every prerendered homepage and preserves localized response headers", async () => {
  const assets = vi.spyOn(env.ASSETS, "fetch")

  for (const locale of I18N.SUPPORTED_LOCALES) {
    const pathname = locale === I18N.DEFAULT_LOCALE ? "/" : `/${locale}`
    const asset = new Response(`<html lang="${locale}"><body>Homepage</body></html>`, {
      headers: { "Content-Type": "text/html", ETag: "homepage" },
    })
    const rewritten = `<html lang="${locale}" data-ppp="70"><body>Homepage</body></html>`
    assets.mockResolvedValueOnce(asset)
    transformAsset.mockReturnValueOnce(new Response(rewritten, asset))

    const response = await worker.fetch(new Request(`http://localhost${pathname}`, { headers: { "cf-ipcountry": "PL" } }), env, context)
    await expectPricingAttribute()
    expect(transformAsset.mock.lastCall?.[0]).toBe(asset)
    expect(await response.text()).toBe(rewritten)
    expect(response.headers.get("content-type")).toBe("text/html")
    expect(response.headers.get("etag")).toBe("homepage")
    if (locale !== I18N.DEFAULT_LOCALE) {
      expect(response.headers.get("set-cookie")).toContain(`${I18N.COOKIE_NAME}=${locale}`)
    }
  }

  expect(transformAsset).toHaveBeenCalledTimes(I18N.SUPPORTED_LOCALES.length)
  expect(fetchHandler).not.toHaveBeenCalled()
})

it("leaves full-price homepages and other discounted-country pages unchanged", async () => {
  const assets = vi.spyOn(env.ASSETS, "fetch")
  const pages = [
    { country: "US", pathname: "/" },
    { country: "US", pathname: "/pl-PL" },
    { country: "PL", pathname: "/pl-PL/docs" },
    { country: "PL", pathname: "/terms" },
  ]
  for (const { country, pathname } of pages) {
    const html = "<html><body>Unchanged page</body></html>"
    assets.mockResolvedValueOnce(new Response(html, { headers: { "Content-Type": "text/html" } }))
    const response = await worker.fetch(new Request(`http://localhost${pathname}`, { headers: { "cf-ipcountry": country } }), env, context)

    expect(await response.text()).toBe(html)
  }

  expect(rewriteHandlers).not.toHaveBeenCalled()
  expect(transformAsset).not.toHaveBeenCalled()
  expect(fetchHandler).not.toHaveBeenCalled()
})
