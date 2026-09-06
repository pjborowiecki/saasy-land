import { type ComponentProps, createElement } from "react"
/** @vitest-environment jsdom */

import { describe, expect, it } from "vite-plus/test"

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
