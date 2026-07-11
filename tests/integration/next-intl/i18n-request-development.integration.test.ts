import type { GetRequestConfigParams, RequestConfig } from "next-intl/server"

import i18nRequest from "~/src/integrations/next-intl/i18n.request"

type RequestConfigHandler = (params: GetRequestConfigParams) => RequestConfig | Promise<RequestConfig>

vi.mock(import("next/cache"), () => ({
  cacheLife: vi.fn<() => void>(),
}))

vi.mock(import("next-intl/server"), () => ({
  getRequestConfig: vi.fn<(handler: RequestConfigHandler) => RequestConfigHandler>((handler) => handler),
}))

vi.mock(import("next/root-params"), () => ({
  locale: (): Promise<string> => Promise.resolve("en-US"),
}))

describe("i18n request development mode", () => {
  it("loads locale messages without the production cache path", async () => {
    expect.hasAssertions()
    vi.stubEnv("NODE_ENV", "development")

    try {
      const config = await i18nRequest({ locale: "en-US", requestLocale: Promise.resolve("en-US") })

      expect(config.locale).toBe("en-US")
      expect(config.messages?.["pages"]).toBeDefined()
    } finally {
      vi.unstubAllEnvs()
    }
  })
})
