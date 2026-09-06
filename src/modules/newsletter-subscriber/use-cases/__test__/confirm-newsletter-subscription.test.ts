import type * as StartServerModule from "@tanstack/react-start/server"
import type { Resend } from "resend"
import { describe, expect, it, vi } from "vite-plus/test"

import { JSON_NULL } from "~/src/platform/testing/lib/json-null"
import { executeMutation } from "~/src/platform/testing/lib/query"

import { NEWSLETTER_TOKEN_LENGTH } from "~/src/modules/newsletter-subscriber/newsletter-subscriber.schema"
import { confirmNewsletterSubscriptionMutation } from "~/src/modules/newsletter-subscriber/use-cases/confirm-newsletter-subscription"

import { CONTACT_EMAIL, NOTIFICATIONS_EMAIL } from "~/src/presentation/branding"

const HEADERS = new Headers()

const TOKEN = "d".repeat(NEWSLETTER_TOKEN_LENGTH)
const ADDRESS = "ada@example.com"

const SINGLE_CALL = 1

const resendSendMock = vi.hoisted(() => vi.fn<Resend["emails"]["send"]>())

const dbMocks = vi.hoisted(() => {
  const returning = vi.fn<() => Promise<{ email: string; locale: string }[]>>()
  const where = vi.fn<() => { returning: typeof returning }>().mockReturnValue({ returning })
  const set = vi.fn<(update: Record<string, unknown>) => { where: typeof where }>().mockReturnValue({ where })
  const updateMock = vi.fn<() => { set: typeof set }>().mockReturnValue({ set })

  return { returning, set, updateMock }
})

vi.mock(import("@tanstack/react-start/server-only"), () => ({}))

vi.mock(import("~/src/integrations/resend/resend.config"), async (importOriginal) => {
  const actual = await importOriginal()
  return { ...actual, resend: Object.assign(actual.resend, { emails: { send: resendSendMock } }) }
})

vi.mock(import("~/src/integrations/drizzle-orm/drizzle.database"), async (importOriginal) => {
  const actual = await importOriginal()
  return { ...actual, db: Object.assign(actual.db, { update: dbMocks.updateMock }) }
})

vi.mock(import("@tanstack/react-start/server"), (): Partial<typeof StartServerModule> => ({
  getRequest: vi.fn(() => new Request("http://127.0.0.1:3000/", { headers: HEADERS })),
}))

const mockMatchingToken = (): void => {
  resendSendMock.mockReset()
  resendSendMock.mockResolvedValue({ data: { id: "email_1" }, error: JSON_NULL, headers: JSON_NULL })
  dbMocks.updateMock.mockClear()
  dbMocks.returning.mockResolvedValue([{ email: ADDRESS, locale: "en-US" }])
}

describe("confirm-newsletter-subscription", () => {
  it("moves the row to subscribed and tells the owner", async () => {
    expect.hasAssertions()
    mockMatchingToken()

    await expect(executeMutation(confirmNewsletterSubscriptionMutation, { token: TOKEN })).resolves.toMatchObject({ confirmed: true })

    expect(dbMocks.set).toHaveBeenCalledWith(expect.objectContaining({ status: "subscribed" }))
    expect(resendSendMock).toHaveBeenCalledWith(expect.objectContaining({ from: NOTIFICATIONS_EMAIL, to: CONTACT_EMAIL }), {
      idempotencyKey: `newsletter-notification/${TOKEN}`,
    })
  })

  it("burns the token so the link works once", async () => {
    expect.hasAssertions()
    mockMatchingToken()

    await executeMutation(confirmNewsletterSubscriptionMutation, { token: TOKEN })

    const [update] = dbMocks.set.mock.calls.map(([value]) => value)

    expect(update).toHaveProperty("confirmationToken")
    expect(update).toHaveProperty("confirmationExpiresAt")
  })

  it("reports a token that matched nothing and tells nobody", async () => {
    expect.hasAssertions()
    mockMatchingToken()
    dbMocks.returning.mockResolvedValue([])

    await expect(executeMutation(confirmNewsletterSubscriptionMutation, { token: TOKEN })).resolves.toMatchObject({ confirmed: false })

    expect(resendSendMock).not.toHaveBeenCalled()
  })

  it("keeps the confirmation when the owner notification fails", async () => {
    expect.hasAssertions()
    mockMatchingToken()
    const consoleError = vi.spyOn(console, "error").mockImplementation(() => {})
    resendSendMock.mockResolvedValue({
      data: JSON_NULL,
      error: { message: "failed", name: "application_error", statusCode: JSON_NULL },
      headers: JSON_NULL,
    })

    await expect(executeMutation(confirmNewsletterSubscriptionMutation, { token: TOKEN })).resolves.toMatchObject({ confirmed: true })

    expect(consoleError).toHaveBeenCalledTimes(SINGLE_CALL)
    consoleError.mockRestore()
  })

  it("rejects a token of the wrong length before it reaches a query", async () => {
    expect.hasAssertions()
    mockMatchingToken()

    await expect(executeMutation(confirmNewsletterSubscriptionMutation, { token: "short" })).rejects.toThrow("VALIDATION")
    expect(dbMocks.updateMock).not.toHaveBeenCalled()
  })
})
