import { type ComponentProps, createElement } from "react"
/** @vitest-environment jsdom */

import { describe, expect, it } from "vite-plus/test"

import { ResetPasswordEmail } from "~/src/presentation/emails/reset-password.email-template"

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
