import { expect, test } from "@playwright/test"

test("home renders on default locale without prefix", async ({ page }) => {
  const response = await page.goto("/", { waitUntil: "domcontentloaded" })
  expect(response, "initial navigation should return a response").not.toBeNull()
  expect(response?.ok(), "initial navigation should succeed").toBeTruthy()

  await expect(page, "should land on root URL without prefix").toHaveURL(/.*\/$/)
  await expect(page.locator("body")).toBeVisible()
})
