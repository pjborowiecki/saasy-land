import { act, screen, waitFor } from "@testing-library/react"
import userEvent from "@testing-library/user-event"
import { toast } from "sonner"
import { IntlProvider } from "use-intl/react"
import { beforeEach, describe, expect, it, vi } from "vite-plus/test"

import { createTestRouter, renderWithRouter } from "~/src/platform/testing/lib/render"

import { getTestMessages } from "~/src/integrations/use-intl/__test__/fixtures/messages"
import type { SupportedLocale } from "~/src/integrations/use-intl/i18n.config"

import type { sendVerificationEmailMutation } from "~/src/modules/verification/use-cases/send-verification-email"
import type { verifyEmailMutation } from "~/src/modules/verification/use-cases/verify-email"

import { VerifyEmailPanel } from "~/src/presentation/components/custom/auth/verify-email/components/verify-email-panel"

import { ROUTES } from "~/src/routes"

const TEST_EMAIL = "user@example.com"
const messages = getTestMessages("en-US")
const formMessages = messages.pages.auth["verify-email"].form
const resendMock = vi.hoisted(() => vi.fn<NonNullable<typeof sendVerificationEmailMutation.mutationFn>>())
const verifyMock = vi.hoisted(() => vi.fn<NonNullable<typeof verifyEmailMutation.mutationFn>>())
const redirectMock = vi.hoisted(() => vi.fn<() => Promise<void>>())

vi.mock(import("~/src/modules/verification/use-cases/send-verification-email"), () => ({
  sendVerificationEmailMutation: { mutationFn: resendMock, mutationKey: ["test", "sendVerificationEmail"] },
}))
vi.mock(import("~/src/modules/verification/use-cases/verify-email"), () => ({
  verifyEmailMutation: { mutationFn: verifyMock, mutationKey: ["test", "verifyEmail"] },
}))
vi.mock(import("~/src/hooks/use-post-auth-redirect"), () => ({
  usePostAuthRedirect: () => redirectMock,
}))

const renderPanel = (props: Readonly<{ email?: string; token?: string }> = {}, locale: SupportedLocale = "en-US") => {
  const router = createTestRouter(ROUTES.VERIFY_EMAIL)
  const navigate = vi.spyOn(router, "navigate").mockResolvedValue()
  renderWithRouter(
    <IntlProvider locale={locale} messages={getTestMessages(locale)}>
      <VerifyEmailPanel {...props} />
    </IntlProvider>,
    { router },
  )
  return { navigate, user: userEvent.setup() }
}

beforeEach(() => {
  vi.clearAllMocks()
  resendMock.mockResolvedValue({ status: true })
  redirectMock.mockResolvedValue()
  vi.spyOn(toast, "success").mockReturnValue(0)
  vi.spyOn(toast, "error").mockReturnValue(0)
})

describe("verify email panel", () => {
  it("leads with sign in and keeps resend as a text action without asking for the signup email again", async () => {
    const { navigate, user } = renderPanel({ email: TEST_EMAIL })
    const signIn = screen.getByRole("button", { name: formMessages.backToSignIn })
    const resend = screen.getByRole("button", { name: formMessages.resend })

    expect(screen.queryByRole("textbox")).not.toBeInTheDocument()
    expect(screen.getAllByRole("button")).toStrictEqual([signIn, resend])
    expect(signIn).toHaveAttribute("data-variant", "default")
    expect(resend).toHaveAttribute("data-variant", "link")
    await user.click(signIn)
    expect(navigate).toHaveBeenCalledWith({ to: ROUTES.SIGN_IN })
    expect(resendMock).not.toHaveBeenCalled()
  })

  it("resends to the signup address once and shows progress until the request finishes", async () => {
    const pending = Promise.withResolvers<{ status: boolean }>()
    resendMock.mockReturnValue(pending.promise)
    const { user } = renderPanel({ email: TEST_EMAIL })

    await user.click(screen.getByRole("button", { name: formMessages.resend }))
    const resending = await screen.findByRole("button", { name: formMessages.resending })
    expect(resending).toBeDisabled()
    await user.click(resending)
    expect(resendMock).toHaveBeenCalledExactlyOnceWith({ callbackURL: ROUTES.APP, email: TEST_EMAIL }, expect.anything())

    await act(async () => {
      pending.resolve({ status: true })
      await pending.promise
    })
    await waitFor(() => {
      expect(screen.getByRole("button", { name: formMessages.resend })).toBeEnabled()
    })
    expect(toast.success).toHaveBeenCalledWith(formMessages.resendSuccess)
  })

  it("preserves the selected locale when returning to sign in and treats a blank address as missing", async () => {
    const { navigate, user } = renderPanel({ email: " " }, "pl-PL")
    const polishFormMessages = getTestMessages("pl-PL").pages.auth["verify-email"].form

    expect(screen.getByRole("textbox", { name: polishFormMessages.email })).toBeVisible()
    await user.click(screen.getByRole("button", { name: polishFormMessages.backToSignIn }))
    expect(navigate).toHaveBeenCalledWith({ to: `/pl-PL${ROUTES.SIGN_IN}` })
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
    expect(resendMock).toHaveBeenCalledExactlyOnceWith({ callbackURL: ROUTES.APP, email: TEST_EMAIL }, expect.anything())
  })

  it("allows recovery from an expired verification link by entering an email", async () => {
    verifyMock.mockRejectedValue(new Error("TOKEN_EXPIRED"))
    const { user } = renderPanel({ token: "expired-token" })

    expect(await screen.findByText(formMessages.invalidToken)).toBeVisible()
    expect(screen.getByRole("button", { name: formMessages.backToSignIn })).toHaveAttribute("data-variant", "default")
    await user.type(screen.getByRole("textbox", { name: formMessages.email }), TEST_EMAIL)
    await user.click(screen.getByRole("button", { name: formMessages.resend }))
    await waitFor(() => {
      expect(toast.success).toHaveBeenCalledWith(formMessages.resendSuccess)
    })
    expect(redirectMock).not.toHaveBeenCalled()
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
