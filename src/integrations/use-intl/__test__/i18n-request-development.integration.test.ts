import { getRequest } from "@tanstack/react-start/server"
import { expect, it, vi } from "vite-plus/test"

import { loadNamespace } from "~/src/integrations/use-intl/i18n.messages"
import { getCurrentLocale } from "~/src/integrations/use-intl/i18n.utils"

const request = (path: string, cookie?: string) =>
  new Request(`http://127.0.0.1:3000${path}`, { headers: cookie === undefined ? {} : { cookie } })

it("loads locale namespaces directly from the Vite module graph", async () => {
  vi.mocked(getRequest).mockReturnValue(request("/pl-PL"))
  const messages = await loadNamespace({ locale: getCurrentLocale(), namespace: "pages.landing" })
  expect(messages).toHaveProperty("metadata.description")
})
