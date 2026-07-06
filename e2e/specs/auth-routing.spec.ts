import { expect, test } from "../fixtures/test"
import { APP_NAVIGATION_WAIT_UNTIL } from "../pages/base-page"

test.describe("auth routing", () => {
  test("unauthenticated /admin redirects to sign-in", async ({ page }) => {
    const response = await page.goto("/admin", { waitUntil: APP_NAVIGATION_WAIT_UNTIL })

    expect(response?.status()).toBeLessThan(400)
    await expect(page).toHaveURL(/\/auth\/sign-in/u)
  })

  test("unauthenticated /en/admin redirects to sign-in (default locale drops /en prefix)", async ({ page }) => {
    await page.goto("/en/admin", { waitUntil: APP_NAVIGATION_WAIT_UNTIL })

    await expect(page).toHaveURL(/\/auth\/sign-in/u)
  })

  test("unauthenticated /app redirects to sign-in", async ({ page }) => {
    await page.goto("/app", { waitUntil: APP_NAVIGATION_WAIT_UNTIL })

    await expect(page).toHaveURL(/\/auth\/sign-in/u)
  })

  test("unauthenticated localized /pl/app redirects to localized sign-in", async ({ page }) => {
    await page.goto("/pl/app", { waitUntil: APP_NAVIGATION_WAIT_UNTIL })

    await expect(page).toHaveURL(/\/pl\/auth\/sign-in/u)
  })

  test("auth callback without session redirects to sign-in", async ({ page }) => {
    await page.goto("/auth/callback", { waitUntil: APP_NAVIGATION_WAIT_UNTIL })

    await expect(page).toHaveURL(/\/auth\/sign-in/u)
  })
})
