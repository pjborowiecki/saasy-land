import { createElement, type JSX } from "react"

import { env } from "~/src/platform/env"

import { sendEmail } from "~/src/modules/identity-access/infrastructure/email/send-email"
import type { ResendEmailResult } from "~/src/modules/identity-access/infrastructure/email/send-resend-email"

const mockEmailBody: JSX.Element = createElement("div", undefined, "body")

const sendResendEmailMock = vi.hoisted(() => vi.fn<(input: unknown) => Promise<ResendEmailResult>>())

vi.mock(import("server-only"), () => ({}))

vi.mock(import("~/src/modules/identity-access/infrastructure/email/send-resend-email"), () => ({
  sendResendEmail: sendResendEmailMock,
}))

function resetSendMock(): void {
  sendResendEmailMock.mockReset()
}

function getSendPayload(): { from: string; subject: string; to: string } {
  const payload = sendResendEmailMock.mock.calls[0]?.[0]
  if (
    typeof payload !== "object" ||
    !payload ||
    !("from" in payload) ||
    !("subject" in payload) ||
    !("to" in payload) ||
    typeof payload.from !== "string" ||
    typeof payload.subject !== "string" ||
    typeof payload.to !== "string"
  ) {
    throw new Error("Expected sendResendEmail to be called with a payload")
  }
  return { from: payload.from, subject: payload.subject, to: payload.to }
}

describe("send email", () => {
  it("sends with default from address", async () => {
    expect.hasAssertions()
    resetSendMock()
    sendResendEmailMock.mockResolvedValue({ id: "email_123", ok: true })

    const result = await sendEmail({
      react: mockEmailBody,
      subject: "Hello",
      to: "user@example.com",
    })

    expect(result).toStrictEqual({ id: "email_123", success: true })
    const payload = getSendPayload()
    expect(payload.subject).toBe("Hello")
    expect(payload.to).toBe("user@example.com")
    expect(payload.from).toContain(env.RESEND_EMAIL_FROM)
  })

  it("uses custom from when provided", async () => {
    expect.hasAssertions()
    resetSendMock()
    sendResendEmailMock.mockResolvedValue({ id: "email_456", ok: true })

    await sendEmail({
      from: "Custom <custom@example.com>",
      react: mockEmailBody,
      subject: "Hi",
      to: "user@example.com",
    })

    expect(getSendPayload().from).toBe("Custom <custom@example.com>")
  })

  it("returns error when transport reports failure", async () => {
    expect.hasAssertions()
    resetSendMock()
    sendResendEmailMock.mockResolvedValue({ error: "Rate limited", ok: false })

    const result = await sendEmail({
      react: mockEmailBody,
      subject: "Hello",
      to: "user@example.com",
    })

    expect(result).toStrictEqual({ error: "Rate limited", success: false })
  })

  it("returns error when send throws", async () => {
    expect.hasAssertions()
    resetSendMock()
    sendResendEmailMock.mockRejectedValue(new Error("Network down"))

    const result = await sendEmail({
      react: mockEmailBody,
      subject: "Hello",
      to: "user@example.com",
    })

    expect(result).toStrictEqual({ error: "Network down", success: false })
  })

  it("returns unknown error for non-Error throws", async () => {
    expect.hasAssertions()
    resetSendMock()
    sendResendEmailMock.mockRejectedValue("boom")

    const result = await sendEmail({
      react: mockEmailBody,
      subject: "Hello",
      to: "user@example.com",
    })

    expect(result).toStrictEqual({ error: "Unknown error sending email", success: false })
  })
})
