/** @vitest-environment jsdom */

import { createElement, type ComponentProps } from "react"

import { VerifyEmail } from "~/src/presentation/emails/verify-email.email-template"

describe("verify email template", () => {
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
