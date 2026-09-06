import { env } from "cloudflare:workers"

import type { JSX } from "react"

import { render } from "react-email"
import { describe, expect, it, vi } from "vite-plus/test"

import { JSON_NULL } from "~/src/platform/testing/lib/json-null"
import { TEST_APP_URL, createTestRequestUrl } from "~/src/platform/testing/lib/test-request"

import { authEmailHandlers } from "~/src/integrations/better-auth/auth.emails"
import { I18N } from "~/src/integrations/use-intl/i18n.config"

import { APP_URL } from "~/src/presentation/branding"

interface ResendSendPayload {
  readonly from: string
  readonly react: JSX.Element
  readonly subject: string
  readonly to: string
}

interface ResendSendResult {
  data: { id: string } | null
  error: { message: string; name: string; statusCode: number | null } | null
  headers: null
}

const CALL_COUNT = 1
const resendSendMock = vi.hoisted(() => vi.fn<(payload: ResendSendPayload, options?: unknown) => Promise<ResendSendResult>>())

vi.mock(import("@tanstack/react-start/server-only"), () => ({}))

// @ts-expect-error Vitest module mock factory is not inferred for resend.config exports.
vi.mock(import("~/src/integrations/resend/resend.config"), () => ({
  resend: { emails: { send: resendSendMock } },
}))

const payload = {
  token: "token",
  url: createTestRequestUrl("/en/auth/callback?callbackURL=%2Fen%2Fapp"),
  user: { email: "user@example.com", name: "User" },
}

const mockSuccessfulSend = (): void => {
  resendSendMock.mockReset()
  resendSendMock.mockResolvedValue({ data: { id: "email_1" }, error: JSON_NULL, headers: JSON_NULL })
}

const mockFailedSend = (): void => {
  resendSendMock.mockReset()
  resendSendMock.mockResolvedValue({
    data: JSON_NULL,
    error: { message: "failed", name: "application_error", statusCode: JSON_NULL },
    headers: JSON_NULL,
  })
}

describe("auth email handlers", () => {
  it.each(["", "null", "{}", '{"callbackURL":12}'])(
    "uses the locale cookie when a repeated signup has no valid callback body: %j",
    async (body) => {
      expect.hasAssertions()
      mockSuccessfulSend()
      const request = new Request(createTestRequestUrl("/_serverFn/sign-up"), {
        body,
        headers: { cookie: `${I18N.COOKIE_NAME}=pl-PL` },
        method: "POST",
      })

      await authEmailHandlers.sendExistingUserVerificationEmail({ user: { ...payload.user, emailVerified: false } }, request)

      expect(resendSendMock).toHaveBeenCalledTimes(CALL_COUNT)
      const email = resendSendMock.mock.calls[0]?.[0]
      expect(email?.subject).toBe("Potwierdź adres e-mail")
      const html = await render(email!.react)
      expect(html).toContain(`href="${TEST_APP_URL}/pl-PL/auth/verify-email?token=`)
    },
  )

  it("uses the public application URL for repeated signup verification when no request is available", async () => {
    expect.hasAssertions()
    mockSuccessfulSend()

    await authEmailHandlers.sendExistingUserVerificationEmail({ user: { ...payload.user, emailVerified: false } })

    expect(resendSendMock).toHaveBeenCalledTimes(CALL_COUNT)
    const email = resendSendMock.mock.calls[0]?.[0]
    expect(email).toMatchObject({ from: env.RESEND_EMAIL_FROM, subject: "Verify your email address", to: payload.user.email })
    const html = await render(email!.react)
    expect(html).toContain(`href="${APP_URL}/auth/verify-email?token=`)
    expect(html).toContain('lang="en-US"')
  })
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
