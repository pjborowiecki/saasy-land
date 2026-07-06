import type { GetRequestConfigParams, RequestConfig } from "next-intl/server"

import i18nRequest from "~/src/integrations/next-intl/i18n.request"

type RequestConfigHandler = (params: GetRequestConfigParams) => RequestConfig | Promise<RequestConfig>

function missingRequestLocale(): Promise<string | undefined> {
  const { locale }: { locale?: string } = {}
  return Promise.resolve(locale)
}

vi.mock(import("next/cache"), () => ({
  cacheLife: vi.fn<() => void>(),
}))

vi.mock(import("next-intl/server"), () => ({
  getRequestConfig: vi.fn<(handler: RequestConfigHandler) => RequestConfigHandler>((handler) => handler),
}))

vi.mock(import("next/root-params"), () => ({
  locale: (): Promise<string> => Promise.resolve("pl-PL"),
}))

describe("i18n request component", () => {
  it("resolves locale, formats, and messages", async () => {
    expect.hasAssertions()
    const config = await i18nRequest({ locale: "en-US", requestLocale: Promise.resolve("en-US") })

    expect(config.locale).toBe("en-US")
    expect(config.formats?.number?.["currency"]).toBeDefined()
    expect(config.messages?.["pages"]).toBeDefined()
  })

  it("falls back to root locale when request locale is missing", async () => {
    expect.hasAssertions()
    const config = await i18nRequest({ requestLocale: missingRequestLocale() })
    expect(config.locale).toBe("pl-PL")
  })
})
