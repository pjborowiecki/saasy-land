/** @vitest-environment jsdom */

import { createElement, type ComponentProps } from "react"

import { ChangeEmailConfirmationEmail } from "~/src/modules/identity-access/infrastructure/email/templates/change-email-confirmation"
import { ResetPasswordEmail } from "~/src/modules/identity-access/infrastructure/email/templates/reset-password"
import { VerifyEmail } from "~/src/modules/identity-access/infrastructure/email/templates/verify-email"

describe("verify email component", () => {
  it("builds verification email element tree", () => {
    expect.hasAssertions()
    const props: ComponentProps<typeof VerifyEmail> = {
      locale: "en-US",
      name: "User",
      verifyUrl: "https://example.com/verify",
    }
    const element = createElement(VerifyEmail, props)
    expect(element.props).toMatchObject(props)
  })
})

describe("reset password email component", () => {
  it("builds reset password email element tree", () => {
    expect.hasAssertions()
    const props: ComponentProps<typeof ResetPasswordEmail> = {
      locale: "en-US",
      name: "User",
      resetPasswordUrl: "https://example.com/reset",
    }
    const element = createElement(ResetPasswordEmail, props)
    expect(element.props).toMatchObject(props)
  })
})

describe("change email confirmation email component", () => {
  it("builds change email confirmation element tree", () => {
    expect.hasAssertions()
    const props: ComponentProps<typeof ChangeEmailConfirmationEmail> = {
      confirmUrl: "https://example.com/confirm",
      locale: "en-US",
      name: "User",
      newEmail: "new@example.com",
    }
    const element = createElement(ChangeEmailConfirmationEmail, props)
    expect(element.props).toMatchObject(props)
  })
})
