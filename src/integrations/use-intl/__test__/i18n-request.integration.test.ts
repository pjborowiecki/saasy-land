import { getRequest } from "@tanstack/react-start/server"
import { describe, expect, it, vi } from "vite-plus/test"

import { I18N } from "~/src/integrations/use-intl/i18n.config"
import { loadNamespace } from "~/src/integrations/use-intl/i18n.messages"
import { getCurrentLocale } from "~/src/integrations/use-intl/i18n.utils"

const request = (path: string, cookie?: string) =>
  new Request(`http://127.0.0.1:3000${path}`, { headers: cookie === undefined ? {} : { cookie } })

describe("request locale and messages", () => {
  it("resolves locale and its messages", async () => {
    vi.mocked(getRequest).mockReturnValue(request("/pl-PL/docs"))
    expect(getCurrentLocale()).toBe("pl-PL")
    expect(await loadNamespace({ locale: getCurrentLocale(), namespace: "pages.landing" })).toHaveProperty("hero.title")
  })
  it("uses the default locale for unprefixed requests", () => {
    vi.mocked(getRequest).mockReturnValue(request("/docs"))
    expect(getCurrentLocale()).toBe(I18N.DEFAULT_LOCALE)
  })
})
