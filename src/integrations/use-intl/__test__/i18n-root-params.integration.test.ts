import { getRequest } from "@tanstack/react-start/server"
import { describe, expect, it, vi } from "vite-plus/test"

import { I18N } from "~/src/integrations/use-intl/i18n.config"
import { getCurrentLocale } from "~/src/integrations/use-intl/i18n.utils"

const request = (path: string, cookie?: string) =>
  new Request(`http://127.0.0.1:3000${path}`, { headers: cookie === undefined ? {} : { cookie } })

describe("locale resolution without route parameters", () => {
  it("narrows a supported path prefix to the locale union", () => {
    vi.mocked(getRequest).mockReturnValue(request("/pl-PL/docs"))
    expect(getCurrentLocale()).toBe("pl-PL")
  })
  it("does not interpret unknown prefixes as supported locales", () => {
    vi.mocked(getRequest).mockReturnValue(request("/zz-ZZ/docs"))
    expect(getCurrentLocale()).toBe("en-US")
  })
  it("uses the cookie for server function requests", () => {
    vi.mocked(getRequest).mockReturnValue(request("/_serverFn/example", `${I18N.COOKIE_NAME}=pl-PL`))
    expect(getCurrentLocale()).toBe("pl-PL")
  })
})
