import { expect, test } from "@playwright/test"

test("home redirects to default locale and renders", async ({ page }) => {
  const response = await page.goto("/", { waitUntil: "domcontentloaded" })
  expect(response, "initial navigation should return a response").not.toBeNull()
  expect(response?.ok(), "initial navigation should succeed").toBeTruthy()

  await expect(page, "should land on default locale prefix").toHaveURL(/\/en(\/|$)/)
  await expect(page.locator("body")).toBeVisible()
})
