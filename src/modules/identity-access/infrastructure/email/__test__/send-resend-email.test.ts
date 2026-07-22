import { createElement } from "react"

import type { CreateEmailOptions } from "resend"

import type * as ResendConfigModule from "~/src/modules/identity-access/infrastructure/email/resend.config"
import { sendResendEmail } from "~/src/modules/identity-access/infrastructure/email/send-resend-email"

vi.mock(import("server-only"), () => ({}))

const resendSendMock = vi.hoisted(() =>
  vi.fn<(options: CreateEmailOptions) => Promise<{ data?: { id: string }; error?: { message: string } }>>(),
)

vi.mock(import("~/src/modules/identity-access/infrastructure/email/resend.config"), async (importOriginal) => {
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
  from: "SaaSy Land <noreply@example.com>",
  react: createElement("div", undefined, "body"),
  subject: "Hello",
  to: "user@example.com",
} as const

describe("send resend email", () => {
  it("returns id on success", async () => {
    expect.hasAssertions()
    resendSendMock.mockReset()

    await expect(sendResendEmail(emailOptions, () => Promise.resolve({ data: { id: "email_123" } }))).resolves.toStrictEqual({
      id: "email_123",
      ok: true,
    })
  })

  it("returns error when provider reports failure", async () => {
    expect.hasAssertions()
    resendSendMock.mockReset()

    await expect(sendResendEmail(emailOptions, () => Promise.resolve({ error: { message: "Rate limited" } }))).resolves.toStrictEqual({
      error: "Rate limited",
      ok: false,
    })
  })

  it("returns error when provider omits id", async () => {
    expect.hasAssertions()
    resendSendMock.mockReset()

    await expect(sendResendEmail(emailOptions, () => Promise.resolve({ data: { id: "" } }))).resolves.toStrictEqual({
      error: "Resend returned no email id",
      ok: false,
    })
  })

  it("normalizes a successful default Resend send", async () => {
    expect.hasAssertions()
    resendSendMock.mockReset()
    resendSendMock.mockResolvedValue({ data: { id: "email_default" } })

    await expect(sendResendEmail(emailOptions)).resolves.toStrictEqual({
      id: "email_default",
      ok: true,
    })
    expect(resendSendMock).toHaveBeenCalledWith(emailOptions)
  })

  it("normalizes a failed default Resend send", async () => {
    expect.hasAssertions()
    resendSendMock.mockReset()
    resendSendMock.mockResolvedValue({ error: { message: "Provider down" } })

    await expect(sendResendEmail(emailOptions)).resolves.toStrictEqual({
      error: "Provider down",
      ok: false,
    })
  })

  it("normalizes an empty default Resend payload", async () => {
    expect.hasAssertions()
    resendSendMock.mockReset()
    resendSendMock.mockResolvedValue({})

    await expect(sendResendEmail(emailOptions)).resolves.toStrictEqual({
      error: "Resend returned no email id",
      ok: false,
    })
  })
})
