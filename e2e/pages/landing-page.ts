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
    // The gate finale repeats the primary CTA; scope to the hero section.
    return this.page.locator("#floor").getByRole("link", { name: /start building/iu })
  }

  navigationGetStartedLink(): Locator {
    // The masthead, hero and gate all carry the same primary CTA label ("Start Building",
    // one label per intent); scope to the banner so this resolves to exactly one link.
    return this.page.getByRole("banner").getByRole("link", { name: /start building/iu })
  }

  navigation(): Locator {
    return this.page.getByRole("banner")
  }
}
