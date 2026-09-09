import { describe, expect, it } from "vite-plus/test"

import { I18N } from "~/src/integrations/use-intl/i18n.config"
import { handleLocaleMiddleware } from "~/src/integrations/use-intl/i18n.middleware"

const polishCookie = `${I18N.COOKIE_NAME}=pl-PL`

describe("locale middleware request boundary", () => {
  it.each([
    ["/@id/virtual:tanstack-start-dev-client-entry", "script"],
    ["/src/presentation/styles/globals.css", "style"],
    ["/@tanstack-start/styles.css?routes=__root__", "style"],
    ["/assets/app-A123.js", "script"],
    ["/favicon.ico", "image"],
    ["/fonts/display.woff2", "font"],
    ["/pl/assets/logo.svg", "image"],
  ])("does not redirect %s or overwrite the document locale", (pathname, destination) => {
    const request = new Request(`https://saasyland.com${pathname}`, {
      headers: { accept: "*/*", cookie: polishCookie, "sec-fetch-dest": destination },
    })

    expect(handleLocaleMiddleware(request)).toEqual({})
  })

  it.each(["empty", "worker", "unknown", "Document", ""])(
    "ignores non-document or malformed Fetch Metadata destination %j even when HTML is accepted",
    (destination) => {
      const request = new Request("https://saasyland.com/", {
        headers: { accept: "text/html", cookie: polishCookie, "sec-fetch-dest": destination },
      })

      expect(handleLocaleMiddleware(request)).toEqual({})
    },
  )

  it.each(["document", "iframe", "frame"])("updates the locale for a %s navigation", (destination) => {
    const request = new Request("https://saasyland.com/", {
      headers: { cookie: polishCookie, "sec-fetch-dest": destination },
    })

    expect(handleLocaleMiddleware(request)).toEqual({ setCookie: { name: I18N.COOKIE_NAME, value: I18N.DEFAULT_LOCALE } })
  })

  it.each(["text/html", "application/xhtml+xml", "application/json, text/html; q=0.9", "TEXT/HTML; charset=utf-8"])(
    "recognizes document Accept %j when Fetch Metadata is unavailable",
    (accept) => {
      const request = new Request("https://saasyland.com/pl-PL/docs", { headers: { accept } })

      expect(handleLocaleMiddleware(request)).toEqual({ setCookie: { name: I18N.COOKIE_NAME, value: "pl-PL" } })
    },
  )

  it.each(["*/*", "text/css,*/*;q=0.1", "application/javascript", "application/json", "text/html-invalid", ""])(
    "ignores non-document Accept %j when Fetch Metadata is unavailable",
    (accept) => {
      const request = new Request("https://saasyland.com/src/presentation/styles/globals.css", {
        headers: { accept, cookie: polishCookie },
      })

      expect(handleLocaleMiddleware(request)).toEqual({})
    },
  )

  it.each(["GET", "HEAD"])("preserves headerless %s document requests and canonical redirects", (method) => {
    const response = handleLocaleMiddleware(new Request("https://saasyland.com/pl/docs?query=one", { method }))

    expect(response.redirect?.status).toBe(308)
    expect(response.redirect?.headers.get("location")).toBe("https://saasyland.com/pl-PL/docs?query=one")
    expect(handleLocaleMiddleware(new Request("https://saasyland.com/pl-PL/docs", { method }))).toEqual({
      setCookie: { name: I18N.COOKIE_NAME, value: "pl-PL" },
    })
  })

  it.each(["POST", "PUT", "DELETE"])("does not treat %s actions as locale navigations", (method) => {
    const request = new Request("https://saasyland.com/pl/docs", {
      headers: { accept: "text/html", cookie: polishCookie, "sec-fetch-dest": "document" },
      method,
    })

    expect(handleLocaleMiddleware(request)).toEqual({})
  })

  it.each(["/api/auth/get-session", "/rpc/messages", "/_serverFn/messages"])(
    "keeps locale cookies unchanged for %s even with document headers",
    (pathname) => {
      const request = new Request(`https://saasyland.com${pathname}`, {
        headers: { accept: "text/html", cookie: polishCookie, "sec-fetch-dest": "document" },
      })

      expect(handleLocaleMiddleware(request)).toEqual({})
    },
  )

  it("does not rewrite an already matching locale cookie", () => {
    const request = new Request("https://saasyland.com/pl-PL/docs", {
      headers: { accept: "text/html", cookie: polishCookie, "sec-fetch-dest": "document" },
    })

    expect(handleLocaleMiddleware(request)).toEqual({})
  })
})
