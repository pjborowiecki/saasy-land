import { describe, expect, it } from "vite-plus/test"

import { TEST_APP_URL, createAuthActionUrl, createCookieHeader, createTestRequestUrl } from "~/src/platform/testing/lib/test-request"

import { I18N } from "~/src/integrations/use-intl/i18n.config"
import {
  localeFromCookie,
  localeFromPathname,
  redirectPathname,
  resolveLocaleFromAuthRequest,
  resolveLocaleFromRequest,
} from "~/src/integrations/use-intl/i18n.locale"

import { ROUTES } from "~/src/routes"

describe("locale from pathname component", () => {
  it("detects prefixed locales", () => {
    expect.hasAssertions()
    expect(localeFromPathname("/en")).toBe("en-US")
    expect(localeFromPathname("/en/docs/about")).toBe("en-US")
    expect(localeFromPathname("/pl")).toBe("pl-PL")
    expect(localeFromPathname("/pl/blog")).toBe("pl-PL")
  })

  it("defaults auth routes to the default locale", () => {
    expect.hasAssertions()
    expect(localeFromPathname("/auth/sign-in")).toBe(I18N.DEFAULT_LOCALE)
  })

  it("uses the default locale for unprefixed document routes", () => {
    expect.hasAssertions()
    expect(localeFromPathname("/")).toBe("en-US")
    expect(localeFromPathname("/docs/about")).toBe("en-US")
  })
})
describe("locale from cookie component", () => {
  it("reads the locale cookie when present", () => {
    expect.hasAssertions()
    const cookie = createCookieHeader(I18N.COOKIE_NAME, "pl-PL")
    expect(localeFromCookie(cookie)).toBe("pl-PL")
  })

  it("returns undefined for invalid or missing cookie values", () => {
    expect.hasAssertions()
    expect(localeFromCookie()).toBeUndefined()
    expect(localeFromCookie(createCookieHeader(I18N.COOKIE_NAME, "invalid"))).toBeUndefined()
  })
})
describe("redirect pathname component", () => {
  it("canonicalizes explicit default-locale prefixes in redirects", () => {
    expect.hasAssertions()
    expect(redirectPathname("/en/admin", ROUTES.SIGN_IN)).toBe("/auth/sign-in")
    expect(redirectPathname("/admin", ROUTES.SIGN_IN)).toBe(ROUTES.SIGN_IN)
  })

  it("localizes redirects for non-default locales", () => {
    expect.hasAssertions()
    expect(redirectPathname("/pl/admin", ROUTES.APP)).toBe("/pl-PL/app")
  })
})
describe("resolve locale from request component", () => {
  it("prefers pathname locale over cookie", () => {
    expect.hasAssertions()
    const cookie = createCookieHeader(I18N.COOKIE_NAME, "pl-PL")
    expect(resolveLocaleFromRequest("/en/admin", cookie)).toBe("en-US")
  })

  it("falls back to cookie then default locale", () => {
    expect.hasAssertions()
    const cookie = createCookieHeader(I18N.COOKIE_NAME, "pl-PL")
    expect(resolveLocaleFromRequest("/_serverFn/example", cookie)).toBe("pl-PL")
    expect(resolveLocaleFromRequest("/admin")).toBe(I18N.DEFAULT_LOCALE)
  })
})
describe("resolve locale from auth request component", () => {
  it("prefers locale encoded in auth callback URLs", () => {
    expect.hasAssertions()
    const request = new Request(TEST_APP_URL, {
      headers: { cookie: createCookieHeader(I18N.COOKIE_NAME, "pl-PL") },
    })
    expect(resolveLocaleFromAuthRequest(request, createAuthActionUrl("/en/auth/sign-in"))).toBe("en-US")
  })

  it("falls back to cookie locale when callback has no document locale", () => {
    expect.hasAssertions()
    const request = new Request(TEST_APP_URL, {
      headers: { cookie: createCookieHeader(I18N.COOKIE_NAME, "pl-PL") },
    })
    expect(resolveLocaleFromAuthRequest(request, createAuthActionUrl("/_serverFn/example"))).toBe("pl-PL")
  })

  it("falls back to default locale when no signals exist", () => {
    expect.hasAssertions()
    expect(resolveLocaleFromAuthRequest(undefined, createAuthActionUrl("/dashboard"))).toBe(I18N.DEFAULT_LOCALE)
  })

  it("ignores invalid auth action URLs", () => {
    expect.hasAssertions()
    expect(resolveLocaleFromAuthRequest(undefined, "http://%")).toBe(I18N.DEFAULT_LOCALE)
  })

  it("ignores invalid callback URLs on auth actions", () => {
    expect.hasAssertions()
    expect(resolveLocaleFromAuthRequest(undefined, createTestRequestUrl("/auth/sign-in?callbackURL=http%3A%2F%2F%"))).toBe(
      I18N.DEFAULT_LOCALE,
    )
  })

  it("falls back to action pathname when callback has no document locale", () => {
    expect.hasAssertions()
    expect(resolveLocaleFromAuthRequest(undefined, createTestRequestUrl("/pl/auth/sign-in?callbackURL=%2Fapi%2Fauth"))).toBe("pl-PL")
  })
})

it("uses the default locale for RPC requests without a locale cookie", () => {
  expect(resolveLocaleFromRequest("/_serverFn/action")).toBe("en-US")
})
