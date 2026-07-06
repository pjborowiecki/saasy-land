import type { Locator } from "@playwright/test"

import { BasePage } from "./base-page"

export class AuthPage extends BasePage {
  async gotoSignIn(localePrefix = ""): Promise<void> {
    const path = localePrefix.length > 0 ? `${localePrefix}/auth/sign-in` : "/auth/sign-in"
    await this.gotoPath(path)
    await this.waitForAppReady()
  }

  async gotoSignUp(localePrefix = ""): Promise<void> {
    const path = localePrefix.length > 0 ? `${localePrefix}/auth/sign-up` : "/auth/sign-up"
    await this.gotoPath(path)
    await this.waitForAppReady()
  }

  async gotoForgotPassword(localePrefix = ""): Promise<void> {
    const path = localePrefix.length > 0 ? `${localePrefix}/auth/forgot-password` : "/auth/forgot-password"
    await this.gotoPath(path)
    await this.waitForAppReady()
  }

  signInHeading(): Locator {
    return this.page.getByRole("heading", { level: 1 })
  }

  signUpHeading(): Locator {
    return this.page.getByRole("heading", { level: 1 })
  }

  forgotPasswordHeading(): Locator {
    return this.page.getByRole("heading", { level: 1 })
  }

  emailField(): Locator {
    return this.page.getByRole("textbox", { name: /email/iu })
  }

  passwordField(): Locator {
    return this.page.locator("#sign-in-password")
  }

  signInSubmitButton(): Locator {
    return this.page.getByTestId("sign-in-form-submit-button")
  }

  signUpSubmitButton(): Locator {
    return this.page.getByRole("button", { name: "Continue" })
  }

  oauthGitHubButton(): Locator {
    return this.page.getByRole("button", { name: /sign in with github/iu })
  }

  async gotoResetPassword(localePrefix = "", query = ""): Promise<void> {
    const path = localePrefix.length > 0 ? `${localePrefix}/auth/reset-password${query}` : `/auth/reset-password${query}`
    await this.gotoPath(path)
    await this.waitForAppReady()
  }

  resetPasswordHeading(): Locator {
    return this.page.getByRole("heading", { level: 1 })
  }

  resetPasswordSubmitButton(): Locator {
    return this.page.getByTestId("reset-password-form-submit-button")
  }

  requestNewResetLink(): Locator {
    return this.page.getByRole("link", { name: /request a new reset link/iu })
  }
}
