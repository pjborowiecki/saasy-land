import { env } from "~/src/platform/env"

import { JSON_NULL } from "~/src/platform/testing/lib/json-null"
import { createTestRequestUrl, TEST_APP_URL } from "~/src/platform/testing/lib/test-request"

import { authEmailHandlers } from "~/src/integrations/better-auth/auth.emails"

interface ResendSendResult {
  data: { id: string } | null
  error: { message: string; name: string; statusCode: number | null } | null
  headers: null
}

const CALL_COUNT = 1
const resendSendMock = vi.hoisted(() => vi.fn<(payload: unknown, options?: unknown) => Promise<ResendSendResult>>())

vi.mock(import("server-only"), () => ({}))

// @ts-expect-error Vitest module mock factory is not inferred for resend.config exports.
vi.mock(import("~/src/integrations/resend/resend.config"), () => ({
  resend: { emails: { send: resendSendMock } },
}))

const payload = {
  token: "token",
  url: createTestRequestUrl("/en/auth/callback?callbackURL=%2Fen%2Fapp"),
  user: { email: "user@example.com", name: "User" },
}

function mockSuccessfulSend(): void {
  resendSendMock.mockReset()
  resendSendMock.mockResolvedValue({ data: { id: "email_1" }, error: JSON_NULL, headers: JSON_NULL })
}

function mockFailedSend(): void {
  resendSendMock.mockReset()
  resendSendMock.mockResolvedValue({
    data: JSON_NULL,
    error: { message: "failed", name: "application_error", statusCode: JSON_NULL },
    headers: JSON_NULL,
  })
}

describe("auth email handlers", () => {
  it("sendResetPasswordEmail sends localized email with an idempotency key", async () => {
    expect.hasAssertions()
    mockSuccessfulSend()

    await authEmailHandlers.sendResetPasswordEmail(payload, new Request(TEST_APP_URL))
    expect(resendSendMock).toHaveBeenCalledTimes(CALL_COUNT)
    expect(resendSendMock).toHaveBeenCalledWith(expect.objectContaining({ from: env.RESEND_EMAIL_FROM, to: payload.user.email }), {
      idempotencyKey: `reset-password/${payload.token}`,
    })
  })

  it("sendVerificationEmail sends localized email with an idempotency key", async () => {
    expect.hasAssertions()
    mockSuccessfulSend()

    await authEmailHandlers.sendVerificationEmail(payload)
    expect(resendSendMock).toHaveBeenCalledTimes(CALL_COUNT)
    expect(resendSendMock).toHaveBeenCalledWith(expect.objectContaining({ from: env.RESEND_EMAIL_FROM, to: payload.user.email }), {
      idempotencyKey: `verify-email/${payload.token}`,
    })
  })

  it("sendChangeEmailConfirmationEmail sends localized email with an idempotency key", async () => {
    expect.hasAssertions()
    mockSuccessfulSend()

    await authEmailHandlers.sendChangeEmailConfirmationEmail({ ...payload, newEmail: "new@example.com" })
    expect(resendSendMock).toHaveBeenCalledTimes(CALL_COUNT)
    expect(resendSendMock).toHaveBeenCalledWith(expect.objectContaining({ from: env.RESEND_EMAIL_FROM, to: payload.user.email }), {
      idempotencyKey: `change-email-confirmation/${payload.token}`,
    })
  })

  it("throws when resend reports an error for any handler", async () => {
    expect.hasAssertions()
    mockFailedSend()

    await expect(authEmailHandlers.sendResetPasswordEmail(payload)).rejects.toThrow("failed")
    await expect(authEmailHandlers.sendVerificationEmail(payload)).rejects.toThrow("failed")
    await expect(authEmailHandlers.sendChangeEmailConfirmationEmail({ ...payload, newEmail: "new@example.com" })).rejects.toThrow("failed")
  })
})
