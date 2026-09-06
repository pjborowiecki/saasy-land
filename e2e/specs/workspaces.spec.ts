import { TEST_ACCOUNTS, TEST_PASSWORD } from "../data/accounts"
import { expect, test } from "../fixtures/test"

for (const account of TEST_ACCOUNTS) {
  test(`${account.role} can sign in and load the permitted workspace`, async ({ authPage, page }) => {
    const errors: string[] = []
    page.on("pageerror", (error) => errors.push(error.message))
    await authPage.gotoSignIn()
    await authPage.emailField().fill(account.email)
    await authPage.passwordField().fill(TEST_PASSWORD)
    await authPage.signInSubmitButton().click()
    const workspace = account.role === "admin" ? "/admin" : "/app"
    await expect(page).toHaveURL(new RegExp(`${workspace}/?$`, "u"))
    await expect(page.getByRole("heading").first()).toBeVisible()

    const paths =
      account.role === "admin"
        ? [
            "/admin/users/all",
            "/admin/users/invitations",
            "/admin/users/roles",
            "/admin/users/security",
            "/admin/products",
            "/admin/products/create",
            "/admin/courses/create",
            "/admin/blog",
            "/admin/blog/create",
            "/admin/analytics",
            "/admin/payments",
            "/admin/pricing-models",
            "/admin/landing-page",
            "/admin/settings",
          ]
        : ["/app/license", "/pl-PL/app"]
    for (const path of paths) {
      await page.goto(path)
      await expect(page.getByRole("heading").first()).toBeVisible()
      await expect(page.getByRole("alert").filter({ hasText: "Something went wrong" })).toHaveCount(0)
      await expect(page.getByText("Page not found", { exact: true })).toHaveCount(0)
      if (path === "/admin/products/create") await expect(page.getByRole("heading", { level: 1 })).toHaveText("Create Product")
      if (path === "/admin/blog/create") await expect(page.getByRole("heading", { level: 1 })).toHaveText("Write Post")
    }
    if (account.role === "customer") {
      await page.goto("/admin")
      await expect(page).toHaveURL(/\/app\/?$/u)
    }
    expect(errors).toEqual([])
  })
}
