import { createTestRequestUrl, TEST_APP_URL } from "~/src/platform/testing/lib/test-request"

import { authEmailHandlers } from "~/src/integrations/better-auth/auth.emails"

type SendEmailResult = { error: string; success: false } | { id: string; success: true }

const CALL_COUNT = 1
const sendEmailMock = vi.hoisted(() => vi.fn<(input: unknown) => Promise<SendEmailResult>>())

vi.mock(import("server-only"), () => ({}))

vi.mock(import("~/src/integrations/resend/resend.utils"), () => ({
  sendEmail: sendEmailMock,
}))

const payload = {
  token: "token",
  url: createTestRequestUrl("/en/auth/callback?callbackURL=%2Fen%2Fapp"),
  user: { email: "user@example.com", name: "User" },
}

function mockSuccessfulSendEmail(): void {
  sendEmailMock.mockReset()
  sendEmailMock.mockResolvedValue({ id: "email_1", success: true })
}

function mockFailedSendEmail(): void {
  sendEmailMock.mockReset()
  sendEmailMock.mockResolvedValue({ error: "failed", success: false })
}

describe("auth email handlers", () => {
  it("sendResetPasswordEmail sends localized email", async () => {
    expect.hasAssertions()
    mockSuccessfulSendEmail()

    await authEmailHandlers.sendResetPasswordEmail(payload, new Request(TEST_APP_URL))
    expect(sendEmailMock).toHaveBeenCalledTimes(CALL_COUNT)
  })

  it("sendVerificationEmail sends localized email", async () => {
    expect.hasAssertions()
    mockSuccessfulSendEmail()

    await authEmailHandlers.sendVerificationEmail(payload)
    expect(sendEmailMock).toHaveBeenCalledTimes(CALL_COUNT)
  })

  it("sendChangeEmailConfirmationEmail sends localized email", async () => {
    expect.hasAssertions()
    mockSuccessfulSendEmail()

    await authEmailHandlers.sendChangeEmailConfirmationEmail({ ...payload, newEmail: "new@example.com" })
    expect(sendEmailMock).toHaveBeenCalledTimes(CALL_COUNT)
  })

  it("throws when sendEmail fails for reset password", async () => {
    expect.hasAssertions()
    mockFailedSendEmail()
    const consoleError = vi.spyOn(console, "error").mockImplementation(() => {})

    await expect(authEmailHandlers.sendResetPasswordEmail(payload)).rejects.toThrow("failed")
    expect(consoleError).toHaveBeenCalledWith(
      "[Auth] Failed to send resetPassword email",
      expect.objectContaining({ email: payload.user.email, error: "failed" }),
    )

    consoleError.mockRestore()
  })

  it("throws when sendEmail fails for verification and change-email handlers", async () => {
    expect.hasAssertions()
    mockFailedSendEmail()
    const consoleError = vi.spyOn(console, "error").mockImplementation(() => {})

    await expect(authEmailHandlers.sendVerificationEmail(payload)).rejects.toThrow("failed")
    await expect(authEmailHandlers.sendChangeEmailConfirmationEmail({ ...payload, newEmail: "new@example.com" })).rejects.toThrow("failed")

    consoleError.mockRestore()
  })
})
