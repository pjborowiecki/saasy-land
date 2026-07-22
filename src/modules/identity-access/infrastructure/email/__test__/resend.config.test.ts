import type { CreateEmailOptions } from "resend"
import type * as ResendModule from "resend"

import { createAppResend, resend, toAppResendResult } from "~/src/modules/identity-access/infrastructure/email/resend.config"

const sendMock = vi.hoisted(() => vi.fn<(options: CreateEmailOptions) => Promise<{ data?: { id: string }; error?: { message: string } }>>())

vi.mock(import("server-only"), () => ({}))

vi.mock(import("resend"), async (importOriginal) => {
  const actual = await importOriginal<typeof ResendModule>()

  class MockResend extends actual.Resend {
    constructor() {
      super("test-resend-key")
      Object.assign(this.emails, { send: sendMock })
    }
  }

  return {
    ...actual,
    Resend: MockResend,
  }
})

const emailOptions = {
  from: "SaaSy Land <noreply@example.com>",
  html: "<p>hi</p>",
  subject: "Hello",
  to: "user@example.com",
} as const satisfies CreateEmailOptions

describe("resend client", () => {
  it("creates resend client with api key", () => {
    expect.hasAssertions()
    expect(resend).toBeDefined()
    expect(resend.emails.send).toBeTypeOf("function")
  })

  it("sends through the live app client", async () => {
    expect.hasAssertions()
    sendMock.mockReset()
    sendMock.mockResolvedValue({ data: { id: "email_live" } })

    await expect(resend.emails.send(emailOptions)).resolves.toStrictEqual({ data: { id: "email_live" } })
    expect(sendMock).toHaveBeenCalledWith(emailOptions)
  })

  it("maps live SDK errors through the app client", async () => {
    expect.hasAssertions()
    sendMock.mockReset()
    sendMock.mockResolvedValue({ error: { message: "quota" } })

    await expect(resend.emails.send(emailOptions)).resolves.toStrictEqual({ error: { message: "quota" } })
  })

  it("maps live empty SDK payloads through the app client", async () => {
    expect.hasAssertions()
    sendMock.mockReset()
    sendMock.mockResolvedValue({})

    await expect(resend.emails.send(emailOptions)).resolves.toStrictEqual({})
  })
})

describe("resend result mapping", () => {
  it("maps SDK errors", () => {
    expect.hasAssertions()
    expect(toAppResendResult({ error: { message: "quota" } })).toStrictEqual({ error: { message: "quota" } })
  })

  it("maps successful data", () => {
    expect.hasAssertions()
    expect(toAppResendResult({ data: { id: "email_1" } })).toStrictEqual({ data: { id: "email_1" } })
  })

  it("maps missing and non-object data", () => {
    expect.hasAssertions()
    expect(toAppResendResult({})).toStrictEqual({})
    expect(toAppResendResult({ data: "bad" })).toStrictEqual({})
    expect(toAppResendResult({ data: Object.create(null) })).toStrictEqual({})
  })

  it("maps objects with missing or non-string ids", () => {
    expect.hasAssertions()
    expect(toAppResendResult({ data: {} })).toStrictEqual({ data: {} })
    expect(toAppResendResult({ data: { id: 1 } })).toStrictEqual({ data: {} })
  })
})

describe("app resend factory", () => {
  it("sends through the SDK client and normalizes the result", async () => {
    expect.hasAssertions()
    const send = vi.fn<(options: CreateEmailOptions) => Promise<{ data?: { id: string }; error?: { message: string } }>>()
    send.mockResolvedValue({ data: { id: "email_2" } })
    const appResend = createAppResend({ emails: { send } })

    await expect(appResend.emails.send(emailOptions)).resolves.toStrictEqual({ data: { id: "email_2" } })
    expect(send).toHaveBeenCalledWith(emailOptions)
  })
})
