import { expect, test } from "../fixtures/test"

test("documentation loads MDX and follows a sidebar link through the router", async ({ appPage, page }) => {
  const errors: string[] = []
  page.on("pageerror", (error) => errors.push(error.message))
  await page.goto("/docs/getting-started")
  await appPage.waitForAppReady()
  await expect(page.getByRole("heading", { level: 1 })).toBeVisible()
  await page.locator('a[href="/docs/getting-started/installation"]').first().click()
  await expect(page).toHaveURL(/\/docs\/getting-started\/installation$/u)
  await expect(page.getByRole("heading", { level: 1 })).toHaveText("Local development")
  expect(errors).toEqual([])
})

test("Polish documentation retains its locale during navigation", async ({ appPage, page }) => {
  await page.goto("/pl-PL/docs/getting-started")
  await appPage.waitForAppReady()
  await expect(page.locator("html")).toHaveAttribute("lang", "pl-PL")
  await page.locator('a[href="/pl-PL/docs/getting-started/installation"]').first().click()
  await expect(page).toHaveURL(/\/pl-PL\/docs\/getting-started\/installation$/u)
  await expect(page.locator("html")).toHaveAttribute("lang", "pl-PL")
})

test("blog opens a published article without browser errors", async ({ appPage, page }) => {
  const errors: string[] = []
  page.on("pageerror", (error) => errors.push(error.message))
  await page.goto("/blog")
  await appPage.waitForAppReady()
  await page.locator('main a[href^="/blog/"]').first().click()
  await expect(page).toHaveURL(/\/blog\/.+/u)
  await expect(page.getByRole("heading", { level: 1 })).toBeVisible()
  expect(errors).toEqual([])
})
