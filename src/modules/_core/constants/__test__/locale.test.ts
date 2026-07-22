import { Locale } from "~/src/modules/_core/constants/locale"
import { ValidationError } from "~/src/modules/_core/errors/validation.error"

describe("locale value object", () => {
  it("creates a locale from a valid code", () => {
    expect.hasAssertions()
    const locale = Locale.create("en-US")
    expect(locale.code).toBe("en-US")
    expect(locale.dir).toBe("ltr")
    expect(locale.messageKey).toBe("locales.en-US")
  })

  it("rejects unknown locale codes", () => {
    expect.hasAssertions()
    expect(() => Locale.create("xx-XX")).toThrow(ValidationError)
  })

  it("exposes the default locale", () => {
    expect.hasAssertions()
    expect(Locale.DEFAULT_CODE).toBe("en-US")
    expect(Locale.default().equals(Locale.create("en-US"))).toBe(true)
  })

  it("stringifies to the locale code", () => {
    expect.hasAssertions()
    expect(Locale.create("pl-PL").toString()).toBe("pl-PL")
    expect(Locale.create("en-US").equals(Locale.create("pl-PL"))).toBe(false)
  })
})
