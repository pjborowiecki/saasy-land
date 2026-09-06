import { type ComponentProps, createElement } from "react"
/** @vitest-environment jsdom */

import { describe, expect, it } from "vite-plus/test"

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
