import { expect, it } from "vite-plus/test"

import { APP_DOMAIN, APP_URL } from "~/src/presentation/branding"

it("derives the application URL from the application domain", () => {
  expect(APP_URL).toBe(`https://${APP_DOMAIN}`)
})
