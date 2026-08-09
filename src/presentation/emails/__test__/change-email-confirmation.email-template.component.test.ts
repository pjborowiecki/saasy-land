/** @vitest-environment jsdom */

import { createElement, type ComponentProps } from "react"

import { ChangeEmailConfirmationEmail } from "~/src/presentation/emails/change-email-confirmation.email-template"

describe("change email confirmation template", () => {
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
