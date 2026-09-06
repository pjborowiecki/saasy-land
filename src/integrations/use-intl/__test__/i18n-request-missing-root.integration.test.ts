import { getRequest } from "@tanstack/react-start/server"
import { expect, it, vi } from "vite-plus/test"

import { I18N } from "~/src/integrations/use-intl/i18n.config"
import { getCurrentLocale } from "~/src/integrations/use-intl/i18n.utils"

const request = (path: string, cookie?: string) =>
  new Request(`http://127.0.0.1:3000${path}`, { headers: cookie === undefined ? {} : { cookie } })

it("defaults a request without a locale segment even when a previous locale cookie exists", () => {
  vi.mocked(getRequest).mockReturnValue(request("/", `${I18N.COOKIE_NAME}=pl-PL`))
  expect(getCurrentLocale()).toBe(I18N.DEFAULT_LOCALE)
})
