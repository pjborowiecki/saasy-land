import type { Locator } from "@playwright/test"

import { BasePage } from "./base-page"

export class LandingPage extends BasePage {
  async goto(localePrefix = ""): Promise<void> {
    await this.gotoPath(localePrefix.length > 0 ? localePrefix : "/")
    await this.waitForAppReady()
  }

  heroHeading(): Locator {
    return this.page.getByRole("heading", { level: 1 })
  }

  heroGetStartedLink(): Locator {
    return this.page.getByRole("link", { name: /start building/iu })
  }

  navigationGetStartedLink(): Locator {
    return this.page.getByRole("link", { name: "Get Started" })
  }

  navigation(): Locator {
    return this.page.getByRole("banner")
  }
}
