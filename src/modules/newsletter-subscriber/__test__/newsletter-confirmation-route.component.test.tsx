import { StrictMode } from "react"

import { screen } from "@testing-library/react"
import { IntlProvider } from "use-intl/react"
import { afterEach, beforeEach, describe, expect, it, vi } from "vite-plus/test"

import { renderWithRouter } from "~/src/platform/testing/lib/render"

import { getTestMessages } from "~/src/integrations/use-intl/__test__/fixtures/messages"

import { NEWSLETTER_TOKEN_LENGTH } from "~/src/modules/newsletter-subscriber/newsletter-subscriber.schema"

import { Route } from "~/src/routes/_landing.newsletter.confirm"

const confirmMock = vi.hoisted(() => vi.fn<(data: { token: string }) => Promise<{ confirmed: boolean }>>())
const TOKEN = "a".repeat(NEWSLETTER_TOKEN_LENGTH)
const messages = getTestMessages("pl-PL")

vi.mock(import("~/src/modules/newsletter-subscriber/use-cases/confirm-newsletter-subscription"), () => ({
  confirmNewsletterSubscriptionMutation: { mutationFn: confirmMock, mutationKey: ["test", "confirmNewsletterSubscription"] },
}))

const renderConfirmation = (token?: string) => {
  vi.spyOn(Route, "useSearch").mockReturnValue({ token })
  const Page = Route.options.component
  if (Page === undefined) {
    throw new Error("The newsletter confirmation route has no page component")
  }

  return renderWithRouter(
    <IntlProvider locale="pl-PL" messages={messages}>
      <StrictMode>
        <Page />
      </StrictMode>
    </IntlProvider>,
  )
}

beforeEach(() => {
  confirmMock.mockReset()
})
afterEach(() => {
  vi.restoreAllMocks()
})

describe("newsletter confirmation route", () => {
  it("confirms a token once and renders the localized success page", async () => {
    confirmMock.mockResolvedValue({ confirmed: true })
    renderConfirmation(TOKEN)

    expect(await screen.findByRole("heading", { name: messages.pages.newsletter.confirm.confirmed.title })).toBeVisible()
    expect(confirmMock).toHaveBeenCalledExactlyOnceWith({ token: TOKEN }, expect.anything())
    expect(screen.getByRole("link")).toHaveAttribute("href", "/pl-PL")
  })

  it("renders the expired-link page for a missing token without requesting confirmation", () => {
    renderConfirmation()

    expect(screen.getByRole("heading", { name: messages.pages.newsletter.confirm.expired.title })).toBeVisible()
    expect(confirmMock).not.toHaveBeenCalled()
  })

  it("renders the expired-link page when the server rejects a spent token", async () => {
    confirmMock.mockResolvedValue({ confirmed: false })
    renderConfirmation(TOKEN)

    expect(await screen.findByRole("heading", { name: messages.pages.newsletter.confirm.expired.title })).toBeVisible()
  })

  it("shows a recoverable error when confirmation cannot reach the server", async () => {
    confirmMock.mockRejectedValue(new Error("Connection failed"))
    renderConfirmation(TOKEN)

    expect(await screen.findByRole("heading", { name: messages.pages.newsletter.confirm.error.title })).toBeVisible()
    expect(confirmMock).toHaveBeenCalledOnce()
  })
})
