import { createElement, type JSX } from "react"

import type { CreateEmailResponse } from "resend"

import { env } from "~/src/platform/env"

import type * as ResendConfigModule from "~/src/integrations/resend/resend.config"
import { sendEmail as deliverEmail, type EmailSendFn } from "~/src/integrations/resend/resend.utils"

const mockEmailBody: JSX.Element = createElement("div", undefined, "body")

const resendSendMock = vi.hoisted(() => vi.fn<EmailSendFn>())

vi.mock(import("server-only"), () => ({}))

// @ts-expect-error Vitest module mock factory is not inferred for resend.config exports.
vi.mock(import("~/src/integrations/resend/resend.config"), async (importOriginal) => {
  const actual = await importOriginal<typeof ResendConfigModule>()
  return {
    ...actual,
    resend: {
      emails: {
        send: resendSendMock,
      },
    },
  }
})

const emailOptions = {
  react: mockEmailBody,
  subject: "Hello",
  to: "user@example.com",
} as const

/* eslint-disable unicorn/no-null -- Resend SDK response union uses null */
function emailSuccess(id: string): CreateEmailResponse {
  return { data: { id }, error: null, headers: null }
}

function emailFailure(message: string): CreateEmailResponse {
  return {
    data: null,
    error: { message, name: "application_error", statusCode: null },
    headers: null,
  }
}
/* eslint-enable unicorn/no-null */

function createSendMock(): EmailSendFn {
  return vi.fn<EmailSendFn>()
}

function readSendPayload(sendMock: EmailSendFn): { from: string; subject: string; to: string } {
  const payload = vi.mocked(sendMock).mock.calls[0]?.[0]
  if (
    payload === undefined ||
    typeof payload !== "object" ||
    !("from" in payload) ||
    !("subject" in payload) ||
    !("to" in payload) ||
    typeof payload.from !== "string" ||
    typeof payload.subject !== "string" ||
    typeof payload.to !== "string"
  ) {
    throw new Error("Expected sendEmail transport to be called with a payload")
  }

  return { from: payload.from, subject: payload.subject, to: payload.to }
}

function readResendClientPayload(): { from: string; subject: string; to: string } {
  const payload = resendSendMock.mock.calls[0]?.[0]
  if (
    payload === undefined ||
    typeof payload !== "object" ||
    !("from" in payload) ||
    !("subject" in payload) ||
    !("to" in payload) ||
    typeof payload.from !== "string" ||
    typeof payload.subject !== "string" ||
    typeof payload.to !== "string"
  ) {
    throw new Error("Expected default resend client to receive a payload")
  }

  return { from: payload.from, subject: payload.subject, to: payload.to }
}

describe("sendEmail", () => {
  it("sends with default from address", async () => {
    expect.hasAssertions()
    const sendMock = createSendMock()
    vi.mocked(sendMock).mockResolvedValue(emailSuccess("email_123"))

    const result = await deliverEmail(emailOptions, sendMock)
    const payload = readSendPayload(sendMock)

    expect(result).toStrictEqual({ id: "email_123", success: true })
    expect(payload.subject).toBe("Hello")
    expect(payload.to).toBe("user@example.com")
    expect(payload.from).toContain(env.RESEND_EMAIL_FROM)
  })

  it("uses custom from when provided", async () => {
    expect.hasAssertions()
    const sendMock = createSendMock()
    vi.mocked(sendMock).mockResolvedValue(emailSuccess("email_456"))

    await deliverEmail({ ...emailOptions, from: "Custom <custom@example.com>", subject: "Hi" }, sendMock)

    expect(readSendPayload(sendMock).from).toBe("Custom <custom@example.com>")
  })

  it("returns error when transport reports failure", async () => {
    expect.hasAssertions()
    const sendMock = createSendMock()
    vi.mocked(sendMock).mockResolvedValue(emailFailure("Rate limited"))

    await expect(deliverEmail(emailOptions, sendMock)).resolves.toStrictEqual({ error: "Rate limited", success: false })
  })

  it("returns error when transport omits id", async () => {
    expect.hasAssertions()
    const sendMock = createSendMock()
    vi.mocked(sendMock).mockResolvedValue(emailSuccess(""))

    await expect(deliverEmail(emailOptions, sendMock)).resolves.toStrictEqual({
      error: "Resend returned no email id",
      success: false,
    })
  })

  it("returns error when send throws", async () => {
    expect.hasAssertions()
    const sendMock = createSendMock()
    vi.mocked(sendMock).mockRejectedValue(new Error("Network down"))

    await expect(deliverEmail(emailOptions, sendMock)).resolves.toStrictEqual({ error: "Network down", success: false })
  })

  it("returns unknown error for non-Error throws", async () => {
    expect.hasAssertions()
    const sendMock = createSendMock()
    vi.mocked(sendMock).mockRejectedValue("boom")

    await expect(deliverEmail(emailOptions, sendMock)).resolves.toStrictEqual({
      error: "Unknown error sending email",
      success: false,
    })
  })
})

describe("sendEmail via resend client", () => {
  it("uses the default resend client", async () => {
    expect.hasAssertions()
    resendSendMock.mockReset()
    resendSendMock.mockResolvedValue(emailSuccess("email_default"))

    await expect(deliverEmail(emailOptions)).resolves.toStrictEqual({ id: "email_default", success: true })

    const payload = readResendClientPayload()
    expect(payload.from).toContain(env.RESEND_EMAIL_FROM)
    expect(payload.subject).toBe("Hello")
    expect(payload.to).toBe("user@example.com")
  })

  it("maps default client failures", async () => {
    expect.hasAssertions()
    resendSendMock.mockReset()
    resendSendMock.mockResolvedValue(emailFailure("Provider down"))

    await expect(deliverEmail(emailOptions)).resolves.toStrictEqual({ error: "Provider down", success: false })
  })
})
