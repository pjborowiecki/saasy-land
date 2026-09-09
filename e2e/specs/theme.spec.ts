import { TEST_ACCOUNTS, TEST_PASSWORD } from "../data/accounts"
import { expect, test } from "../fixtures/test"
import { APP_NAVIGATION_WAIT_UNTIL } from "../pages/base-page"

const PREFERENCES = [
  { expected: "dark", stored: "dark", system: "light" },
  { expected: "light", stored: "light", system: "dark" },
  { expected: "dark", stored: "system", system: "dark" },
  { expected: "dark", stored: null, system: "dark" },
] as const

for (const preference of PREFERENCES) {
  test(`workspace applies ${preference.stored ?? "default"} theme before hydration with ${preference.system} system preference`, async ({
    baseURL,
    page,
  }) => {
    await page.emulateMedia({ colorScheme: preference.system })
    await page.addInitScript((stored) => {
      if (stored === null) {
        localStorage.removeItem("SaaSy Land-theme")
      } else {
        localStorage.setItem("SaaSy Land-theme", stored)
      }
      const observer = new MutationObserver(() => {
        if (document.body) {
          document.body.dataset["themeBeforeBody"] = document.documentElement.style.colorScheme
          observer.disconnect()
        }
      })
      observer.observe(document, { childList: true, subtree: true })
    }, preference.stored)
    // The server-rendered document must have the correct theme even if hydration never runs.
    await page.route("**/*", (route) => (route.request().resourceType() === "script" ? route.abort() : route.continue()))
    const account = TEST_ACCOUNTS[0]
    const signedIn = await page.request.post("/api/auth/sign-in/email", {
      data: { email: account.email, password: TEST_PASSWORD },
      headers: { "CF-Connecting-IP": `2001:db8::${crypto.randomUUID().slice(0, 4)}`, Origin: baseURL ?? "http://127.0.0.1:3000" },
    })
    expect(signedIn.ok()).toBe(true)
    for (const path of ["/app", "/admin"]) {
      await page.goto(path, { waitUntil: APP_NAVIGATION_WAIT_UNTIL })
      await expect(page).toHaveURL(new RegExp(`${path}/?$`, "u"))
      await expect(page.locator("body")).toHaveAttribute("data-theme-before-body", preference.expected)
      await expect(page.locator("html")).toHaveClass(new RegExp(`\\b${preference.expected}\\b`, "u"))
      await expect(page.locator("html")).toHaveCSS("color-scheme", preference.expected)
      await expect(page.getByRole("heading").first()).toBeVisible()
    }
  })
}

test("documentation theme selector changes and persists the selected theme", async ({ appPage, page }) => {
  await page.addInitScript(() => {
    if (!localStorage.getItem("SaaSy Land-theme")) localStorage.setItem("SaaSy Land-theme", "dark")
  })
  await page.goto("/docs/getting-started")
  await appPage.waitForAppReady()
  await page.getByRole("button", { name: /Dark/u }).click()
  await page.getByRole("option", { name: "Light", exact: true }).click()
  await expect(page.locator("html")).toHaveClass(/\blight\b/u)
  expect(await page.evaluate(() => localStorage.getItem("SaaSy Land-theme"))).toBe("light")
  await page.reload()
  await appPage.waitForAppReady()
  await expect(page.getByRole("button", { name: /Light/u })).toBeVisible()
  await expect(page.locator("html")).toHaveClass(/\blight\b/u)
})
