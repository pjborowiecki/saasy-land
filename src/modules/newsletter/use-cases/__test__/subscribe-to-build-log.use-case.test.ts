import type * as NextHeadersModule from "next/headers"

import { env } from "~/src/platform/env"

import { JSON_NULL } from "~/src/platform/testing/lib/json-null"

import { ERROR_CODES } from "~/src/modules/_core/constants/errors"
import { subscribeToBuildLog } from "~/src/modules/newsletter/use-cases/subscribe-to-build-log.use-case"

import { CONTACT_EMAIL } from "~/src/presentation/branding"

interface ResendSendResult {
  data: { id: string } | null
  error: { message: string; name: string; statusCode: number | null } | null
  headers: null
}

const HEADERS = new Headers()
const SUBSCRIBER = "Ada@Example.com"
const ADDRESS = "ada@example.com"
const SEND_COUNT = 2
/** `toHaveBeenNthCalledWith` counts from one. */
const NOTIFICATION_CALL = 1
const CONFIRMATION_CALL = 2

const resendSendMock = vi.hoisted(() => vi.fn<(payload: unknown, options?: unknown) => Promise<ResendSendResult>>())

vi.mock(import("server-only"), () => ({}))

const redisMocks = vi.hoisted(() => {
  const FIRST_COUNT = 1
  return {
    expire: vi.fn<() => Promise<number>>(() => Promise.resolve(FIRST_COUNT)),
    incr: vi.fn<() => Promise<number>>(() => Promise.resolve(FIRST_COUNT)),
  }
})

// @ts-expect-error Vitest module mock factory is not inferred for the redis client export.
vi.mock(import("~/src/integrations/redis/redis.config"), () => ({ redis: redisMocks }))

// @ts-expect-error Vitest module mock factory is not inferred for resend.config exports.
vi.mock(import("~/src/integrations/resend/resend.config"), () => ({
  resend: { emails: { send: resendSendMock } },
}))

vi.mock(
  import("next/headers"),
  (): Partial<typeof NextHeadersModule> => ({
    headers: vi.fn<() => Promise<Headers>>(() => Promise.resolve(HEADERS)),
  }),
)

function mockSuccessfulSend(): void {
  resendSendMock.mockReset()
  resendSendMock.mockResolvedValue({ data: { id: "email_1" }, error: JSON_NULL, headers: JSON_NULL })
}

describe("subscribe-to-build-log", () => {
  it("notifies the owner and confirms to the subscriber", async () => {
    expect.hasAssertions()
    mockSuccessfulSend()

    await expect(subscribeToBuildLog({ email: SUBSCRIBER, locale: "pl-PL" })).resolves.toMatchObject({
      data: { subscribed: true },
    })

    expect(resendSendMock).toHaveBeenCalledTimes(SEND_COUNT)
    expect(resendSendMock).toHaveBeenNthCalledWith(
      NOTIFICATION_CALL,
      expect.objectContaining({ from: env.RESEND_EMAIL_FROM, to: CONTACT_EMAIL }),
      { idempotencyKey: `build-log-notification/${ADDRESS}` },
    )
    expect(resendSendMock).toHaveBeenNthCalledWith(
      CONFIRMATION_CALL,
      expect.objectContaining({ from: env.RESEND_EMAIL_FROM, to: ADDRESS }),
      { idempotencyKey: `build-log-confirmation/${ADDRESS}` },
    )
  })

  it("reports a server error when Resend rejects the send", async () => {
    expect.hasAssertions()
    resendSendMock.mockReset()
    resendSendMock.mockResolvedValue({
      data: JSON_NULL,
      error: { message: "failed", name: "application_error", statusCode: JSON_NULL },
      headers: JSON_NULL,
    })

    await expect(subscribeToBuildLog({ email: ADDRESS, locale: "en-US" })).resolves.toMatchObject({
      serverError: { code: ERROR_CODES.INTERNAL_ERROR },
    })
  })

  it("rejects an address that is not an email and sends nothing", async () => {
    expect.hasAssertions()
    mockSuccessfulSend()

    const result = await subscribeToBuildLog({ email: "not-an-email", locale: "en-US" })

    expect(result.validationErrors).toBeDefined()
    expect(resendSendMock).not.toHaveBeenCalled()
  })

  it("rejects a locale the app does not serve", async () => {
    expect.hasAssertions()
    mockSuccessfulSend()

    // @ts-expect-error The action rejects locales outside the enabled set at runtime too.
    const result = await subscribeToBuildLog({ email: ADDRESS, locale: "de-DE" })

    expect(result.validationErrors).toBeDefined()
    expect(resendSendMock).not.toHaveBeenCalled()
  })
})
