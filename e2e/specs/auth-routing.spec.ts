import { TEST_ACCOUNTS, TEST_PASSWORD } from "../data/accounts"
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

    await expect(page).toHaveURL(/\/pl-PL\/auth\/sign-in/u)
  })

  test("auth callback without session redirects to sign-in", async ({ page }) => {
    await page.goto("/auth/callback", { waitUntil: APP_NAVIGATION_WAIT_UNTIL })

    await expect(page).toHaveURL(/\/auth\/sign-in/u)
  })
})

for (const account of TEST_ACCOUNTS) {
  test(`${account.role} bypasses sign-in and sign-up on direct and client navigation`, async ({ appPage, baseURL, landingPage, page }) => {
    const errors: string[] = []
    page.on("pageerror", (error) => errors.push(error.message))
    const signedIn = await page.request.post("/api/auth/sign-in/email", {
      data: { email: account.email, password: TEST_PASSWORD },
      headers: { "CF-Connecting-IP": `2001:db8::${crypto.randomUUID().slice(0, 4)}`, Origin: baseURL ?? "http://127.0.0.1:3000" },
    })
    expect(signedIn.ok()).toBe(true)
    const workspace = account.role === "admin" ? "/admin" : "/app"
    for (const prefix of ["", "/pl-PL"]) {
      for (const route of ["/auth/sign-in", "/auth/sign-up"]) {
        const response = await page.goto(`${prefix}${route}`, { waitUntil: APP_NAVIGATION_WAIT_UNTIL })
        await expect(page).toHaveURL(new RegExp(`${prefix}${workspace}/?$`, "u"))
        const html = await response?.text()
        expect(html).not.toContain('id="sign-in-form"')
        expect(html).not.toContain('id="sign-up-form"')
        await appPage.waitForAppReady()
        await expect(page.getByRole("heading").first()).toBeVisible()
      }
    }
    for (const path of ["/auth/sign-in", "/auth/sign-up"]) {
      await landingPage.goto()
      await page.locator(`a[href^="${path}"]`).first().click()
      await expect(page).toHaveURL(new RegExp(`${workspace}/?$`, "u"))
      await appPage.waitForAppReady()
      await expect(page.locator("#sign-in-form, #sign-up-form")).toHaveCount(0)
    }
    expect(errors).toEqual([])
  })
}

test("client navigation rechecks an ended session despite cached workspace data", async ({ appPage, authPage, baseURL, page }) => {
  const customer = TEST_ACCOUNTS[1]
  const signedIn = await page.request.post("/api/auth/sign-in/email", {
    data: { email: customer.email, password: TEST_PASSWORD },
    headers: { "CF-Connecting-IP": `2001:db8::${crypto.randomUUID().slice(0, 4)}`, Origin: baseURL ?? "http://127.0.0.1:3000" },
  })
  expect(signedIn.ok()).toBe(true)
  await page.goto("/app", { waitUntil: APP_NAVIGATION_WAIT_UNTIL })
  await appPage.waitForAppReady()
  // End the server session without running the UI's cache cleanup.
  const signedOut = await page.request.post("/api/auth/sign-out", { data: {}, headers: { Origin: new URL(page.url()).origin } })
  expect(signedOut.ok()).toBe(true)
  await page.getByRole("navigation", { name: "App navigation", exact: true }).getByRole("link", { name: "License", exact: true }).click()
  await expect(page).toHaveURL(/\/auth\/sign-in$/u)
  await appPage.waitForAppReady()
  await expect(authPage.signInSubmitButton()).toBeVisible()
  await expect(page.getByText(customer.email, { exact: true })).toHaveCount(0)
  await page.goto("/auth/sign-up", { waitUntil: APP_NAVIGATION_WAIT_UNTIL })
  await expect(page).toHaveURL(/\/auth\/sign-up$/u)
  await appPage.waitForAppReady()
  await expect(page.locator("#sign-up-form")).toBeVisible()
})
