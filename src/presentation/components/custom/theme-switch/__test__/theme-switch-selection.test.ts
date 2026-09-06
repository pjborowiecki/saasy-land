import { describe, expect, it, vi } from "vite-plus/test"

import { JSON_NULL } from "~/src/platform/testing/lib/json-null"

import { applyThemeSelection, isThemeValue } from "~/src/presentation/components/custom/theme-switch"

describe("theme value guard", () => {
  it("accepts known theme keys", () => {
    expect.hasAssertions()
    expect(isThemeValue("light")).toBe(true)
    expect(isThemeValue("dark")).toBe(true)
    expect(isThemeValue("system")).toBe(true)
  })

  it("rejects non-string and unknown keys", () => {
    expect.hasAssertions()
    expect(isThemeValue(Number.NaN)).toBe(false)
    expect(isThemeValue("invalid-theme")).toBe(false)
    expect(isThemeValue(JSON_NULL)).toBe(false)
  })
})

describe("theme selection side effects", () => {
  it("calls setTheme for valid theme keys", () => {
    expect.hasAssertions()
    const setTheme = vi.fn<Parameters<typeof applyThemeSelection>[1]>()

    applyThemeSelection("dark", setTheme)

    expect(setTheme).toHaveBeenCalledWith("dark")
  })

  it("skips setTheme for invalid theme keys", () => {
    expect.hasAssertions()
    const setTheme = vi.fn<Parameters<typeof applyThemeSelection>[1]>()

    applyThemeSelection("invalid-theme", setTheme)

    expect(setTheme).not.toHaveBeenCalled()
  })
})
