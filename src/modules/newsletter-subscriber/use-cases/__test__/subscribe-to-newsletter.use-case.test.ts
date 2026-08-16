import type * as NextHeadersModule from "next/headers"

import type { Resend } from "resend"

import { env } from "~/src/platform/env"

import { JSON_NULL } from "~/src/platform/testing/lib/json-null"

import { ERROR_CODES } from "~/src/modules/_core/constants/errors"
import { SUBSCRIPTION_RESULT } from "~/src/modules/newsletter-subscriber/newsletter-subscriber.constants"
import { newsletterSubscriberZodSchemas } from "~/src/modules/newsletter-subscriber/newsletter-subscriber.zod"
import { subscribeToNewsletter } from "~/src/modules/newsletter-subscriber/use-cases/subscribe-to-newsletter.use-case"

const HEADERS = new Headers()

const SUBSCRIBER = "Ada@Example.com"
const ADDRESS = "ada@example.com"

const SINGLE_CALL = 1

const resendSendMock = vi.hoisted(() => vi.fn<Resend["emails"]["send"]>())

const dbMocks = vi.hoisted(() => {
  const onConflictDoUpdate = vi.fn<() => Promise<void>>().mockResolvedValue()
  const values = vi
    .fn<(row: { confirmationToken: string; email: string }) => { onConflictDoUpdate: typeof onConflictDoUpdate }>()
    .mockReturnValue({ onConflictDoUpdate })
  const insertMock = vi.fn<() => { values: typeof values }>().mockReturnValue({ values })

  const limit = vi.fn<() => Promise<{ status: string }[]>>()
  const where = vi.fn<() => { limit: typeof limit }>().mockReturnValue({ limit })
  const from = vi.fn<() => { where: typeof where }>().mockReturnValue({ where })
  const selectMock = vi.fn<() => { from: typeof from }>().mockReturnValue({ from })

  return { insertMock, limit, selectMock, values }
})

vi.mock(import("server-only"), () => ({}))

const redisMocks = vi.hoisted(() => {
  const FIRST_COUNT = 1
  return {
    del: vi.fn<() => Promise<number>>(() => Promise.resolve(FIRST_COUNT)),
    expire: vi.fn<() => Promise<number>>(() => Promise.resolve(FIRST_COUNT)),
    get: vi.fn<() => Promise<string | null>>(() => Promise.resolve(JSON_NULL)),
    getdel: vi.fn<() => Promise<string | null>>(() => Promise.resolve(JSON_NULL)),
    incr: vi.fn<() => Promise<number>>(() => Promise.resolve(FIRST_COUNT)),
    set: vi.fn<() => Promise<string | null>>(() => Promise.resolve(JSON_NULL)),
  }
})

vi.mock(import("~/src/integrations/redis/redis.config"), () => ({ redis: redisMocks }))

vi.mock(import("~/src/integrations/resend/resend.config"), async (importOriginal) => {
  const actual = await importOriginal()
  return { ...actual, resend: Object.assign(actual.resend, { emails: { send: resendSendMock } }) }
})

vi.mock(import("~/src/platform/db/client"), async (importOriginal) => {
  const actual = await importOriginal()
  return { ...actual, db: Object.assign(actual.db, { insert: dbMocks.insertMock, select: dbMocks.selectMock }) }
})

vi.mock(
  import("next/headers"),
  (): Partial<typeof NextHeadersModule> => ({
    headers: vi.fn<() => Promise<Headers>>(() => Promise.resolve(HEADERS)),
  }),
)

function mockSuccessfulSend(): void {
  resendSendMock.mockReset()
  resendSendMock.mockResolvedValue({ data: { id: "email_1" }, error: JSON_NULL, headers: JSON_NULL })
  dbMocks.insertMock.mockClear()
  dbMocks.values.mockClear()
  dbMocks.limit.mockResolvedValue([])
}

describe("subscribe-to-newsletter", () => {
  it("stores the address as pending and asks the owner of it to confirm", async () => {
    expect.hasAssertions()
    mockSuccessfulSend()

    await expect(subscribeToNewsletter({ email: SUBSCRIBER, locale: "pl-PL" })).resolves.toMatchObject({
      data: { status: SUBSCRIPTION_RESULT.CONFIRMATION_SENT },
    })

    const [row] = dbMocks.values.mock.calls.map(([value]) => value)
    const [payload, options] = resendSendMock.mock.calls[0]!

    expect(row).toHaveProperty("email", ADDRESS)
    expect(payload).toHaveProperty("to", ADDRESS)
    expect(payload).toHaveProperty("from", env.RESEND_EMAIL_FROM)
    expect(options).toStrictEqual({ idempotencyKey: `newsletter-confirmation/${row!.confirmationToken}` })
  })

  it("tells nobody but the address itself that it was entered", async () => {
    expect.hasAssertions()
    mockSuccessfulSend()

    await subscribeToNewsletter({ email: SUBSCRIBER, locale: "en-US" })

    const recipients = resendSendMock.mock.calls.map(([payload]) => payload.to)

    expect(recipients).toStrictEqual([ADDRESS])
  })

  it("gives every attempt a fresh confirmation window", async () => {
    expect.hasAssertions()
    mockSuccessfulSend()

    await subscribeToNewsletter({ email: SUBSCRIBER, locale: "en-US" })
    await subscribeToNewsletter({ email: SUBSCRIBER, locale: "en-US" })

    const tokens = dbMocks.values.mock.calls.map(([row]) => row.confirmationToken)

    expect(new Set(tokens).size).toBe(tokens.length)
  })

  it("reports an address that is already on the list and sends nothing", async () => {
    expect.hasAssertions()
    mockSuccessfulSend()
    dbMocks.limit.mockResolvedValue([{ status: "subscribed" }])

    await expect(subscribeToNewsletter({ email: SUBSCRIBER, locale: "en-US" })).resolves.toMatchObject({
      data: { status: SUBSCRIPTION_RESULT.ALREADY_SUBSCRIBED },
    })

    expect(dbMocks.insertMock).not.toHaveBeenCalled()
    expect(resendSendMock).not.toHaveBeenCalled()
  })

  it("asks an address that had unsubscribed to confirm again", async () => {
    expect.hasAssertions()
    mockSuccessfulSend()
    dbMocks.limit.mockResolvedValue([{ status: "unsubscribed" }])

    await expect(subscribeToNewsletter({ email: SUBSCRIBER, locale: "en-US" })).resolves.toMatchObject({
      data: { status: SUBSCRIPTION_RESULT.CONFIRMATION_SENT },
    })

    expect(dbMocks.insertMock).toHaveBeenCalledTimes(SINGLE_CALL)
  })

  it("reports a server error when Resend rejects the send", async () => {
    expect.hasAssertions()
    mockSuccessfulSend()
    resendSendMock.mockResolvedValue({
      data: JSON_NULL,
      error: { message: "failed", name: "application_error", statusCode: JSON_NULL },
      headers: JSON_NULL,
    })

    await expect(subscribeToNewsletter({ email: ADDRESS, locale: "en-US" })).resolves.toMatchObject({
      serverError: { code: ERROR_CODES.INTERNAL_ERROR },
    })
  })

  it("rejects an address that is not an email and sends nothing", async () => {
    expect.hasAssertions()
    mockSuccessfulSend()

    const result = await subscribeToNewsletter({ email: "not-an-email", locale: "en-US" })

    expect(result.validationErrors).toBeDefined()
    expect(resendSendMock).not.toHaveBeenCalled()
  })

  it("rejects a locale the app does not serve", () => {
    expect.hasAssertions()
    mockSuccessfulSend()

    const result = newsletterSubscriberZodSchemas.subscribeToNewsletter.safeParse({ email: ADDRESS, locale: "de-DE" })

    expect(result.success).toBe(false)
    expect(resendSendMock).not.toHaveBeenCalled()
  })
})
