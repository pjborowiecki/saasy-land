import { instant } from "@next/playwright"

import { expect, test } from "../fixtures/test"


test.describe("instant navigation", () => {
  test("landing page paints its hero on a direct visit", async ({ page, baseURL }) => {
    await instant(
      page,
      async () => {
        await page.goto("/")
        // Static + cached-translation content, so it belongs in the shell.
        await expect(page.getByRole("banner")).toBeVisible()
        await expect(page.getByRole("heading", { level: 1 })).toBeVisible()
      },
      baseURL === undefined ? {} : { baseURL },
    )
  })

  test("sign-in page paints its form shell on a direct visit", async ({ page, baseURL }) => {
    await instant(
      page,
      async () => {
        await page.goto("/auth/sign-in")
        await expect(page.getByRole("heading", { level: 1 })).toBeVisible()
      },
      baseURL === undefined ? {} : { baseURL },
    )
  })

  /*
   * The pricing tier buttons, not the masthead CTA.
   *
   * Every "Start building" on the landing (masthead, hero, closing screen) is an in-page anchor
   * to `#pricing`: the page deliberately routes every visitor through the tiers rather than
   * dropping them straight into sign-up. The three tier buttons are the page's only real
   * commercial exit, so they are the client navigation worth asserting is instant.
   */
  test("landing to sign-up is instant on a client navigation", async ({ page }) => {
    await page.goto("/")

    await instant(page, async () => {
      await page.locator("#pricing").getByRole("link", { name: /get the codebase/iu }).click()
      await page.waitForURL((url) => url.pathname.endsWith("/auth/sign-up"))
      await expect(page.getByRole("heading", { level: 1 })).toBeVisible()
    })
  })

  test("legal pages are fully static on a direct visit", async ({ page, baseURL }) => {
    await instant(
      page,
      async () => {
        await page.goto("/terms")
        await expect(page.getByRole("heading", { level: 1 })).toBeVisible()
      },
      baseURL === undefined ? {} : { baseURL },
    )
  })
})
