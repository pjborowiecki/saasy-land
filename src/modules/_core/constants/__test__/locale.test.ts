import { describe, expect, it } from "vite-plus/test"

import { LOCALES, LOCALE_CODES, getLocaleDirection, isLocaleCode } from "~/src/modules/_core/constants/locale"

describe("locale catalog", () => {
  it("keeps locale codes unique and BCP 47 shaped", () => {
    expect.hasAssertions()
    expect(LOCALE_CODES.size).toBe(LOCALES.length)
    for (const locale of LOCALES) {
      expect(locale.code).toMatch(/^[a-z]{2}-[A-Z]{2}$/u)
    }
  })

  it("recognizes known and rejects unknown codes", () => {
    expect.hasAssertions()
    expect(isLocaleCode("en-US")).toBe(true)
    expect(isLocaleCode("xx-XX")).toBe(false)
  })

  it("resolves text direction with an ltr fallback", () => {
    expect.hasAssertions()
    expect(getLocaleDirection("ar-SA")).toBe("rtl")
    expect(getLocaleDirection("en-US")).toBe("ltr")
    expect(getLocaleDirection("xx-XX")).toBe("ltr")
  })
})
