import { describe, expect, it } from "vite-plus/test"

import { I18N } from "~/src/integrations/use-intl/i18n.config"
import { canonicalizePathname, deLocalizePathname, localizePathname } from "~/src/integrations/use-intl/i18n.paths"
describe("router locale rewrites", () => {
  it("canonicalizes the short aliases used by existing links", () => {
    expect(canonicalizePathname("/pl/docs")).toBe("/pl-PL/docs")
    expect(canonicalizePathname("/en/docs")).toBe("/docs")
  })
  it("round-trips the same internal route through each locale", () => {
    for (const locale of I18N.SUPPORTED_LOCALES) {
      expect(deLocalizePathname(localizePathname({ locale, pathname: "/docs" }))).toBe("/docs")
    }
  })
})

it("keeps external and fragment links unchanged", () => {
  for (const pathname of ["https://example.com", "//example.com", "#pricing", "mailto:test@example.com", "/api/search"]) {
    expect(localizePathname({ locale: "pl-PL", pathname })).toBe(pathname)
  }
})
it("normalizes locale roots and prefixed API links", () => {
  expect(deLocalizePathname("/pl-PL")).toBe("/")
  expect(canonicalizePathname("/pl-PL/api/search")).toBe("/api/search")
})
