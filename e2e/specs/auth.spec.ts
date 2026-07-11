import { expect, test } from "../fixtures/test"

test.describe("auth", () => {
  test("sign-in page renders email and password fields", async ({ authPage }) => {
    await authPage.gotoSignIn()

    await expect(authPage.signInHeading()).toBeVisible()
    await expect(authPage.emailField()).toBeVisible()
    await expect(authPage.passwordField()).toBeVisible()
    await expect(authPage.signInSubmitButton()).toBeVisible()
  })

  test("sign-up page renders email field", async ({ authPage }) => {
    await authPage.gotoSignUp()

    await expect(authPage.signUpHeading()).toBeVisible()
    await expect(authPage.emailField()).toBeVisible()
  })

  test("prefixed locale sign-up route is reachable", async ({ authPage, page }) => {
    await authPage.gotoSignUp("/en")

    await expect(page).toHaveURL(/\/auth\/sign-up/u)
    await expect(authPage.emailField()).toBeVisible()
  })

  test("forgot-password page renders email field", async ({ authPage }) => {
    await authPage.gotoForgotPassword()

    await expect(authPage.forgotPasswordHeading()).toBeVisible()
    await expect(authPage.emailField()).toBeVisible()
  })

  test("sign-in page exposes GitHub OAuth button", async ({ authPage }) => {
    await authPage.gotoSignIn()

    await expect(authPage.oauthGitHubButton()).toBeVisible()
  })

  test("reset-password page without token shows invalid link state", async ({ authPage }) => {
    await authPage.gotoResetPassword()

    await expect(authPage.requestNewResetLink()).toBeVisible()
  })

  test("reset-password page with token renders the reset form", async ({ authPage }) => {
    await authPage.gotoResetPassword("", "?token=test-token")

    await expect(authPage.resetPasswordHeading()).toBeVisible()
    await expect(authPage.resetPasswordSubmitButton()).toBeVisible()
  })

  test("sign-in page links to sign-up", async ({ authPage, page }) => {
    await authPage.gotoSignIn()

    await page.getByRole("link", { name: /sign up/iu }).click()

    await expect(page).toHaveURL(/\/auth\/sign-up/u)
  })

  test("verify-email page renders pending state", async ({ authPage }) => {
    await authPage.gotoVerifyEmail()

    await expect(authPage.signInHeading()).toBeVisible()
    await expect(authPage.verifyEmailResendButton()).toBeVisible()
  })

  test("verify-email page with token shows verifying state", async ({ authPage }) => {
    await authPage.gotoVerifyEmail("", "?token=test-token")

    await expect(authPage.verifyEmailVerifyingState()).toBeVisible()
  })

  test("two-factor page renders authentication form", async ({ authPage }) => {
    await authPage.gotoTwoFactor()

    await expect(authPage.signInHeading()).toBeVisible()
    await expect(authPage.twoFactorSubmitButton()).toBeVisible()
  })

  test("terms page renders legal content", async ({ authPage }) => {
    await authPage.gotoTerms()

    await expect(authPage.legalDocumentTitle()).toBeVisible()
  })

  test("privacy page renders legal content", async ({ authPage }) => {
    await authPage.gotoPrivacy()

    await expect(authPage.legalDocumentTitle()).toBeVisible()
  })
})
