import { act, fireEvent, screen, waitFor } from "@testing-library/react"
import userEvent from "@testing-library/user-event"
import { toast } from "sonner"
import { IntlProvider } from "use-intl/react"
import { beforeEach, describe, expect, it, vi } from "vite-plus/test"

import { createTestRouter, renderWithRouter } from "~/src/platform/testing/lib/render"

import { createAuthSessionFixture } from "~/src/integrations/better-auth/__test__/fixtures/auth.session.fixture"
import { getCurrentSessionQuery } from "~/src/integrations/better-auth/auth.session"
import { getTestMessages } from "~/src/integrations/use-intl/__test__/fixtures/messages"
import type { SupportedLocale } from "~/src/integrations/use-intl/i18n.config"

import type { sendVerificationEmailMutation } from "~/src/modules/verification/use-cases/send-verification-email"
import { VERIFICATION_MUTATION_KEYS } from "~/src/modules/verification/verification.constants"

import { VerifyEmailPanel } from "~/src/presentation/components/custom/auth/verify-email/components/verify-email-panel"

import { ROUTES } from "~/src/routes"

const TEST_EMAIL = "user@example.com"
const messages = getTestMessages("en-US")
const formMessages = messages.pages.auth["verify-email"].form
const resendMock = vi.hoisted(() => vi.fn<NonNullable<typeof sendVerificationEmailMutation.mutationFn>>())

vi.mock(import("~/src/modules/verification/use-cases/send-verification-email"), () => ({
  sendVerificationEmailMutation: { mutationFn: resendMock, mutationKey: VERIFICATION_MUTATION_KEYS.SEND_EMAIL },
}))

const renderPanel = (props: Readonly<{ email?: string; invalid?: boolean }> = {}, locale: SupportedLocale = "en-US") => {
  const router = createTestRouter(ROUTES.VERIFY_EMAIL)
  const { queryClient } = renderWithRouter(
    <IntlProvider locale={locale} messages={getTestMessages(locale)}>
      <VerifyEmailPanel {...props} />
    </IntlProvider>,
    { router },
  )
  return { queryClient, user: userEvent.setup() }
}

beforeEach(() => {
  vi.clearAllMocks()
  resendMock.mockResolvedValue({ status: true })
  vi.spyOn(toast, "success").mockReturnValue(0)
  vi.spyOn(toast, "error").mockReturnValue(0)
})

describe("verify email panel", () => {
  it("leads with a sign-in link and keeps resend as a text action without asking for the signup email again", () => {
    renderPanel({ email: TEST_EMAIL })
    const signIn = screen.getByRole("link", { name: formMessages.backToSignIn })
    const resend = screen.getByRole("button", { name: formMessages.resend })

    expect(screen.queryByRole("textbox")).not.toBeInTheDocument()
    expect(signIn).toHaveAttribute("href", ROUTES.SIGN_IN)
    expect(resend).toHaveAttribute("data-variant", "link")
    expect(resendMock).not.toHaveBeenCalled()
  })

  it("resends to the signup address once and shows progress until the request finishes", async () => {
    const pending = Promise.withResolvers<{ status: boolean }>()
    resendMock.mockReturnValue(pending.promise)
    const { queryClient, user } = renderPanel({ email: ` ${TEST_EMAIL} ` })
    queryClient.setQueryData(getCurrentSessionQuery.queryKey, createAuthSessionFixture())

    await user.click(screen.getByRole("button", { name: formMessages.resend }))
    const resending = await screen.findByRole("button", { name: formMessages.resending })
    expect(resending).toBeDisabled()
    await user.click(resending)
    const form = resending.closest("form")
    expect(form).not.toBeNull()
    if (form) {
      fireEvent.submit(form)
    }
    expect(resendMock).toHaveBeenCalledExactlyOnceWith({ callbackURL: ROUTES.AUTH_CALLBACK, email: TEST_EMAIL }, expect.anything())

    await act(async () => {
      pending.resolve({ status: true })
      await pending.promise
    })
    await waitFor(() => {
      expect(screen.getByRole("button", { name: formMessages.resend })).toBeEnabled()
    })
    expect(toast.success).toHaveBeenCalledWith(formMessages.resendSuccess)
    expect(queryClient.getQueryState(getCurrentSessionQuery.queryKey)?.isInvalidated).toBe(false)
  })

  it("preserves the selected locale for sign in and resend and treats a blank address as missing", async () => {
    const { user } = renderPanel({ email: " " }, "pl-PL")
    const polishFormMessages = getTestMessages("pl-PL").pages.auth["verify-email"].form

    expect(screen.getByRole("link", { name: polishFormMessages.backToSignIn })).toHaveAttribute("href", `/pl-PL${ROUTES.SIGN_IN}`)
    await user.type(screen.getByRole("textbox", { name: polishFormMessages.email }), TEST_EMAIL)
    await user.click(screen.getByRole("button", { name: polishFormMessages.resend }))
    await waitFor(() => {
      expect(resendMock).toHaveBeenCalledExactlyOnceWith(
        { callbackURL: `/pl-PL${ROUTES.AUTH_CALLBACK}`, email: TEST_EMAIL },
        expect.anything(),
      )
    })
  })

  it("allows someone visiting without an email to provide one before resending", async () => {
    const { user } = renderPanel()
    const resend = screen.getByRole("button", { name: formMessages.resend })

    await user.click(resend)
    expect(toast.error).toHaveBeenCalledWith(formMessages.emailRequired)
    expect(resendMock).not.toHaveBeenCalled()

    await user.type(screen.getByRole("textbox", { name: formMessages.email }), TEST_EMAIL)
    await user.click(resend)
    await waitFor(() => {
      expect(toast.success).toHaveBeenCalledWith(formMessages.resendSuccess)
    })
    expect(resendMock).toHaveBeenCalledExactlyOnceWith({ callbackURL: ROUTES.AUTH_CALLBACK, email: TEST_EMAIL }, expect.anything())
  })

  it("blocks malformed email addresses using native form validation", async () => {
    const { user } = renderPanel()
    const email = screen.getByRole("textbox", { name: formMessages.email })

    await user.type(email, "invalid-address")
    await user.click(screen.getByRole("button", { name: formMessages.resend }))

    expect(email).toBeInvalid()
    expect(resendMock).not.toHaveBeenCalled()
  })

  it("allows recovery from an invalid verification link by entering an email", async () => {
    const { user } = renderPanel({ invalid: true })

    expect(screen.getByText(formMessages.invalidToken)).toBeVisible()
    expect(screen.getByRole("link", { name: formMessages.backToSignIn })).toHaveAttribute("href", ROUTES.SIGN_IN)
    await user.type(screen.getByRole("textbox", { name: formMessages.email }), TEST_EMAIL)
    await user.click(screen.getByRole("button", { name: formMessages.resend }))
    await waitFor(() => {
      expect(toast.success).toHaveBeenCalledWith(formMessages.resendSuccess)
    })
  })

  it("lets the user retry a failed resend instead of leaving the action disabled", async () => {
    resendMock.mockRejectedValueOnce(new Error("Email delivery failed"))
    const { user } = renderPanel({ email: TEST_EMAIL })

    await user.click(screen.getByRole("button", { name: formMessages.resend }))
    await waitFor(() => {
      expect(toast.error).toHaveBeenCalledWith(messages.errors.action.INTERNAL_ERROR)
    })
    expect(screen.getByRole("button", { name: formMessages.resend })).toBeEnabled()
    await user.click(screen.getByRole("button", { name: formMessages.resend }))
    await waitFor(() => {
      expect(toast.success).toHaveBeenCalledWith(formMessages.resendSuccess)
    })
    expect(resendMock).toHaveBeenCalledTimes(2)
  })
})
