import { createElement, type JSX } from "react"

import type { CreateEmailResponse } from "resend"

import { env } from "~/src/environment"

import * as resendConfig from "~/src/integrations/resend/resend.config"

import { sendEmail } from "~/src/lib/_utils/email"

const mockEmailBody: JSX.Element = createElement("div", undefined, "body")

type SendEmailFn = typeof resendConfig.resend.emails.send

const sendMock = vi.hoisted(() => vi.fn<SendEmailFn>())

vi.mock(import("server-only"), () => ({}))

function createSuccessResponse(id: string): CreateEmailResponse {
  return { data: { id }, error: null, headers: null }
}

function createFailureResponse(message: string): CreateEmailResponse {
  return {
    data: null,
    error: { message, name: "application_error", statusCode: 429 },
    headers: null,
  }
}

function createMissingIdResponse(): CreateEmailResponse {
  return { data: { id: "" }, error: null, headers: null }
}

function resetSendMock(): void {
  sendMock.mockReset()
  vi.spyOn(resendConfig.resend.emails, "send").mockImplementation(sendMock)
}

describe("send email component", () => {
  it("sends with default from address", async () => {
    expect.hasAssertions()
    resetSendMock()
    sendMock.mockResolvedValue(createSuccessResponse("email_123"))

    const result = await sendEmail({
      react: mockEmailBody,
      subject: "Hello",
      to: "user@example.com",
    })

    expect(result).toStrictEqual({ id: "email_123", success: true })
    expect(sendMock.mock.calls[0]?.[0]).toMatchObject({
      subject: "Hello",
      to: "user@example.com",
    })
    expect(sendMock.mock.calls[0]?.[0].from).toContain(env.RESEND_EMAIL_FROM)
  })

  it("uses custom from when provided", async () => {
    expect.hasAssertions()
    resetSendMock()
    sendMock.mockResolvedValue(createSuccessResponse("email_456"))

    await sendEmail({
      from: "Custom <custom@example.com>",
      react: mockEmailBody,
      subject: "Hi",
      to: "user@example.com",
    })

    expect(sendMock.mock.calls[0]?.[0]).toMatchObject({ from: "Custom <custom@example.com>" })
  })

  it("returns error when resend reports failure", async () => {
    expect.hasAssertions()
    resetSendMock()
    sendMock.mockResolvedValue(createFailureResponse("Rate limited"))

    const result = await sendEmail({
      react: mockEmailBody,
      subject: "Hello",
      to: "user@example.com",
    })

    expect(result).toStrictEqual({ error: "Rate limited", success: false })
  })

  it("returns error when resend omits id", async () => {
    expect.hasAssertions()
    resetSendMock()
    sendMock.mockResolvedValue(createMissingIdResponse())

    const result = await sendEmail({
      react: mockEmailBody,
      subject: "Hello",
      to: "user@example.com",
    })

    expect(result).toStrictEqual({ error: "Resend returned no email id", success: false })
  })

  it("returns error when send throws", async () => {
    expect.hasAssertions()
    resetSendMock()
    sendMock.mockRejectedValue(new Error("Network down"))

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
    sendMock.mockRejectedValue("boom")

    const result = await sendEmail({
      react: mockEmailBody,
      subject: "Hello",
      to: "user@example.com",
    })

    expect(result).toStrictEqual({ error: "Unknown error sending email", success: false })
  })
})
