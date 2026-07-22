import { createAuthActionUrl, createCookieHeader, createTestRequestUrl, TEST_APP_URL } from "~/src/platform/testing/lib/test-request"

import { I18N } from "~/src/integrations/next-intl/i18n.config"
import {
  isLocale,
  localeFromCookie,
  localeFromPathname,
  localizedPathname,
  redirectPathname,
  resolveLocaleFromAuthRequest,
  resolveLocaleFromRequest,
} from "~/src/integrations/next-intl/i18n.locale"
import { routing } from "~/src/integrations/next-intl/i18n.routing"

import { ROUTES } from "~/src/routes"

describe("is locale component", () => {
  it("accepts configured locales", () => {
    expect.hasAssertions()
    for (const locale of I18N.LOCALES) {
      expect(isLocale(locale)).toBe(true)
    }
  })
  it("rejects unknown locales", () => {
    expect.hasAssertions()
    expect(isLocale("de-DE")).toBe(false)
    expect(isLocale()).toBe(false)
  })
})
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
    expect(localeFromPathname("/auth/sign-in")).toBe(routing.defaultLocale)
  })
  it("returns undefined for unprefixed non-auth routes", () => {
    expect.hasAssertions()
    expect(localeFromPathname("/")).toBeUndefined()
    expect(localeFromPathname("/docs/about")).toBeUndefined()
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
describe("localized pathname component", () => {
  it("omits the prefix for the default locale", () => {
    expect.hasAssertions()
    expect(localizedPathname("en-US", "/admin")).toBe("/admin")
  })
  it("adds the prefix for non-default locales", () => {
    expect.hasAssertions()
    expect(localizedPathname("pl-PL", "/admin")).toBe("/pl/admin")
  })
})
describe("redirect pathname component", () => {
  it("preserves explicit default-locale prefixes in redirects", () => {
    expect.hasAssertions()
    expect(redirectPathname("/en/admin", ROUTES.SIGN_IN)).toBe("/en/auth/sign-in")
    expect(redirectPathname("/admin", ROUTES.SIGN_IN)).toBe(ROUTES.SIGN_IN)
  })
  it("localizes redirects for non-default locales", () => {
    expect.hasAssertions()
    expect(redirectPathname("/pl/admin", ROUTES.APP)).toBe("/pl/app")
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
    expect(resolveLocaleFromRequest("/admin", cookie)).toBe("pl-PL")
    expect(resolveLocaleFromRequest("/admin")).toBe(routing.defaultLocale)
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
  it("falls back to cookie locale when callback has no locale", () => {
    expect.hasAssertions()
    const request = new Request(TEST_APP_URL, {
      headers: { cookie: createCookieHeader(I18N.COOKIE_NAME, "pl-PL") },
    })
    expect(resolveLocaleFromAuthRequest(request, createAuthActionUrl("/dashboard"))).toBe("pl-PL")
  })
  it("falls back to default locale when no signals exist", () => {
    expect.hasAssertions()
    expect(resolveLocaleFromAuthRequest(undefined, createAuthActionUrl("/dashboard"))).toBe(routing.defaultLocale)
  })

  it("ignores invalid auth action URLs", () => {
    expect.hasAssertions()
    expect(resolveLocaleFromAuthRequest(undefined, "http://%")).toBe(routing.defaultLocale)
  })

  it("ignores invalid callback URLs on auth actions", () => {
    expect.hasAssertions()
    expect(resolveLocaleFromAuthRequest(undefined, createTestRequestUrl("/auth/sign-in?callbackURL=http%3A%2F%2F%"))).toBe(
      routing.defaultLocale,
    )
  })

  it("falls back to action pathname when callback has no locale", () => {
    expect.hasAssertions()
    expect(resolveLocaleFromAuthRequest(undefined, createTestRequestUrl("/pl/auth/sign-in?callbackURL=%2Fadmin"))).toBe("pl-PL")
  })
})
