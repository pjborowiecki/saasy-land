import { NextIntlClientProvider } from "next-intl"

import { TranslationsProvider } from "~/src/providers/translations-provider"

describe("translations provider component", () => {
  it("re-exports next-intl provider", () => {
    expect.hasAssertions()
    expect(TranslationsProvider).toBe(NextIntlClientProvider)
  })
})
