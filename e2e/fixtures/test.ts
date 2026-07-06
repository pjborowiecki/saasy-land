import { test as base } from "@playwright/test"

import { AuthPage, LandingPage } from "../pages"

interface AppFixtures {
  authPage: AuthPage
  landingPage: LandingPage
}

export const test = base.extend<AppFixtures>({
  authPage: async ({ page }, runWith) => {
    await runWith(new AuthPage(page))
  },
  landingPage: async ({ page }, runWith) => {
    await runWith(new LandingPage(page))
  },
})

export { expect } from "@playwright/test"
