import { JSON_NULL } from "~/src/platform/testing/lib/json-null"

import {
  applyLocaleNavigation,
  formatLocaleSwitchDisplayText,
  parseLocaleSelection,
} from "~/src/presentation/components/custom/locale-switch"

describe("locale selection parsing", () => {
  it("returns a configured locale for valid string keys", () => {
    expect.hasAssertions()
    expect(parseLocaleSelection("en-US")).toBe("en-US")
    expect(parseLocaleSelection("pl-PL")).toBe("pl-PL")
  })

  it("ignores non-string and invalid locale keys", () => {
    expect.hasAssertions()
    expect(parseLocaleSelection(Number.NaN)).toBeUndefined()
    expect(parseLocaleSelection("not-a-locale")).toBeUndefined()
    expect(parseLocaleSelection(JSON_NULL)).toBeUndefined()
  })
})

describe("locale navigation side effects", () => {
  it("calls router.replace for valid locales", () => {
    expect.hasAssertions()
    const replace = vi.fn<Parameters<typeof applyLocaleNavigation>[2]>()

    applyLocaleNavigation("pl-PL", "/about", replace)

    expect(replace).toHaveBeenCalledWith("/about", { locale: "pl-PL" })
  })

  it("skips router.replace for invalid locales", () => {
    expect.hasAssertions()
    const replace = vi.fn<Parameters<typeof applyLocaleNavigation>[2]>()

    applyLocaleNavigation("not-a-locale", "/about", replace)

    expect(replace).not.toHaveBeenCalled()
  })
})

describe("locale switch display text", () => {
  it("uses selected text when present", () => {
    expect.hasAssertions()
    expect(formatLocaleSwitchDisplayText("Polski", "pl-PL")).toBe("Polski")
  })

  it("falls back to the configured locale label", () => {
    expect.hasAssertions()
    expect(formatLocaleSwitchDisplayText(undefined, "en-US")).toBe("English")
  })
})
