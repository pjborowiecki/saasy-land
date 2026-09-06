import type { Page, Response } from "@playwright/test"

/** Parse the streamed document before checking TanStack hydration and React boundaries. */
export const APP_NAVIGATION_WAIT_UNTIL = "domcontentloaded" as const

const APP_READY_TIMEOUT_MS = 30_000

export class BasePage {
  protected readonly page: Page

  constructor(page: Page) {
    this.page = page
  }

  protected async gotoPath(path: string): Promise<Response | null> {
    return this.page.goto(path, { waitUntil: APP_NAVIGATION_WAIT_UNTIL })
  }

  async waitForAppReady(): Promise<void> {
    await this.page.locator("body").waitFor({ state: "visible" })
    await this.waitForHydration()
  }

  private async waitForHydration(): Promise<void> {
    await this.page.waitForFunction(
      () => {
        // Start clears this bootstrap state once hydration and the response stream have finished.
        const hydration: unknown = Reflect.get(window, "$_TSR")
        if (typeof hydration === "object" && hydration !== null && (!("hydrated" in hydration) || hydration.hydrated !== true)) {
          return false
        }
        for (const node of document.querySelectorAll('div[id^="S:"]')) {
          if (globalThis.getComputedStyle(node).display === "none") {
            return false
          }
        }

        return true
      },
      undefined,
      { timeout: APP_READY_TIMEOUT_MS },
    )
  }
}
