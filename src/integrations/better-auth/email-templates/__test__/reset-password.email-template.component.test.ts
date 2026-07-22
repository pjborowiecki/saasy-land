/** @vitest-environment jsdom */

import { createElement, type ComponentProps } from "react"

import { ResetPasswordEmail } from "~/src/integrations/better-auth/email-templates/reset-password.email-template"

describe("reset password email template", () => {
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
