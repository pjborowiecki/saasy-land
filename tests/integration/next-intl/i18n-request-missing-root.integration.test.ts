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

vi.mock(import("next/root-params"), () => ({}))

describe("i18n.request missing root locale export", () => {
  it("falls back when root params omit locale", async () => {
    expect.hasAssertions()
    const config = await i18nRequest({ requestLocale: missingRequestLocale() })
    expect(config.locale).toBe("en-US")
  })
})
