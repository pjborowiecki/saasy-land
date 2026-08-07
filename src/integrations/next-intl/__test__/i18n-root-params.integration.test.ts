import { getRootLocale, tryRootLocale } from "~/src/integrations/next-intl/i18n.root-params"

const rootLocale = vi.hoisted(() => vi.fn<() => Promise<string>>())

vi.mock(import("next/root-params"), () => ({ locale: rootLocale }))

describe("root params locale accessor", () => {
  it("narrows a supported root param to the app locale union", async () => {
    expect.hasAssertions()
    rootLocale.mockReset()
    rootLocale.mockResolvedValue("pl-PL")

    await expect(tryRootLocale()).resolves.toBe("pl-PL")
    await expect(getRootLocale()).resolves.toBe("pl-PL")
  })

  it("rejects a locale outside the app catalog", async () => {
    expect.hasAssertions()
    rootLocale.mockReset()
    rootLocale.mockResolvedValue("de-DE")

    await expect(tryRootLocale()).resolves.toBeUndefined()
    await expect(getRootLocale()).resolves.toBe("en-US")
  })

  it("falls back when the getter throws outside a route context", async () => {
    expect.hasAssertions()
    rootLocale.mockReset()
    // Mirrors the Server Action / Route Handler / unstable_cache paths, which throw.
    rootLocale.mockRejectedValue(new Error("used inside a Server Action"))

    await expect(tryRootLocale()).resolves.toBeUndefined()
    await expect(getRootLocale()).resolves.toBe("en-US")
  })
})
