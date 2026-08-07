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

  test("landing to sign-in is instant on a client navigation", async ({ page }) => {
    await page.goto("/")

    await instant(page, async () => {
      await page.getByRole("link", { name: "Get Started" }).first().click()
      await page.waitForURL((url) => url.pathname.endsWith("/auth/sign-up") || url.pathname.endsWith("/auth/sign-in"))
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
