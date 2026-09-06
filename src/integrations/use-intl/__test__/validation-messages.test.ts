import { describe, expect, it, vi } from "vite-plus/test"

import { translateValidationMessage } from "~/src/integrations/use-intl/validation-messages"

describe("translate validation message", () => {
  it("returns the translation key when no params are configured", () => {
    expect.hasAssertions()

    const t = vi.fn<(key: string) => string>((key) => key)

    expect(translateValidationMessage("nameRequired", t)).toBe("nameRequired")
  })

  it("passes interpolation params to the translator", () => {
    expect.hasAssertions()

    const t = vi.fn<(key: string, values?: Record<string, string | number>) => string>((key, values) => `${key}:${JSON.stringify(values)}`)

    expect(translateValidationMessage("nameMaxLength", t, { nameMaxLength: { max: 255 } })).toBe('nameMaxLength:{"max":255}')
    expect(t).toHaveBeenCalledWith("nameMaxLength", { max: 255 })
  })
})
