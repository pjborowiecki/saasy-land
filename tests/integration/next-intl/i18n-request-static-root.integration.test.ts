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
  locale: "en-US",
}))

describe("i18n.request static root locale", () => {
  it("ignores non-function root locale exports", async () => {
    expect.hasAssertions()
    const config = await i18nRequest({ requestLocale: missingRequestLocale() })
    expect(config.locale).toBe("en-US")
  })
})
