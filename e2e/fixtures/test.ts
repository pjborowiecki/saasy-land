import { expect, test as base } from "@playwright/test"

import { AuthPage, BasePage, LandingPage } from "../pages"

interface AppFixtures {
  appPage: BasePage
  authPage: AuthPage
  landingPage: LandingPage
  checkTranslations: void
}

export const test = base.extend<AppFixtures>({
  appPage: async ({ page }, runWith) => {
    await runWith(new BasePage(page))
  },
  checkTranslations: [
    async ({ page }, runWith) => {
      const errors: string[] = []
      page.on("console", (message) => {
        if (/MISSING_MESSAGE|INVALID_MESSAGE|FORMATTING_ERROR|No messages\//u.test(message.text())) errors.push(message.text())
      })
      await runWith()
      expect(errors, "Every visited page must resolve and format its translations").toEqual([])
    },
    { auto: true },
  ],
  authPage: async ({ page }, runWith) => {
    await runWith(new AuthPage(page))
  },
  landingPage: async ({ page }, runWith) => {
    await runWith(new LandingPage(page))
  },
})

export { expect } from "@playwright/test"
