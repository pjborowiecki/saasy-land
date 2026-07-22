import { localizedPathname } from "~/src/integrations/next-intl/i18n.locale"

vi.mock(import("~/src/integrations/next-intl/i18n.routing"), async (importOriginal) => {
  const original = await importOriginal()

  return {
    ...original,
    localePathPrefixes: {
      ...original.localePathPrefixes,
      "pl-PL": "",
    },
  }
})

describe("localized pathname component", () => {
  it("returns pathname when locale prefix is empty", () => {
    expect.hasAssertions()
    expect(localizedPathname("pl-PL", "/admin")).toBe("/admin")
  })
})
