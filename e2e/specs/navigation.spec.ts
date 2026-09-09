import { expect, test } from "../fixtures/test"

test.describe("server rendering and client navigation", () => {
  for (const path of ["/", "/auth/sign-in", "/terms", "/blog"]) {
    test(`${path} renders its heading before JavaScript runs`, async ({ browser, baseURL }) => {
      const context = await browser.newContext({ ...(baseURL === undefined ? {} : { baseURL }), javaScriptEnabled: false })
      const page = await context.newPage()
      await page.goto(path)
      await expect(page.getByRole("heading", { level: 1 })).toBeVisible()
      if (path === "/auth/sign-in") await expect(page.getByLabel("Email", { exact: true })).toBeVisible()
      if (path === "/blog") await expect(page.locator('main a[href^="/blog/"]').first()).toBeVisible()
      await context.close()
    })
  }

  test("pricing navigates to sign-up without reloading the document", async ({ appPage, page }) => {
    await page.goto("/")
    await appPage.waitForAppReady()
    await page.evaluate(() => (document.documentElement.dataset["navigationProbe"] = "same-document"))
    await page.locator('#pricing a[href^="/auth/sign-up"]').first().click()
    await page.waitForURL((url) => url.pathname.endsWith("/auth/sign-up"))
    await expect(page.getByRole("heading", { level: 1 })).toBeVisible()
    await expect(page.locator("html")).toHaveAttribute("data-navigation-probe", "same-document")
  })
})
