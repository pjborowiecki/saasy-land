import type { Page, Response } from "@playwright/test"

/** Next.js dev + WebKit often never reach `domcontentloaded`; `commit` is reliable. */
export const APP_NAVIGATION_WAIT_UNTIL = "commit" as const

const SUSPENSE_READY_TIMEOUT_MS = 30_000

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
    await this.waitForSuspenseBoundaries()
  }

  private async waitForSuspenseBoundaries(): Promise<void> {
    await this.page.waitForFunction(
      () => {
        for (const node of document.querySelectorAll('div[id^="S:"]')) {
          if (globalThis.getComputedStyle(node).display === "none") {
            return false
          }
        }

        return true
      },
      undefined,
      { timeout: SUSPENSE_READY_TIMEOUT_MS },
    )
  }
}
