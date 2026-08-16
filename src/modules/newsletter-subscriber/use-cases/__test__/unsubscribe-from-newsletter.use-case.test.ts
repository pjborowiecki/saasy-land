import type * as NextHeadersModule from "next/headers"

import { JSON_NULL } from "~/src/platform/testing/lib/json-null"

import { NEWSLETTER_TOKEN_LENGTH } from "~/src/modules/newsletter-subscriber/newsletter-subscriber.schema"
import { unsubscribeFromNewsletter } from "~/src/modules/newsletter-subscriber/use-cases/unsubscribe-from-newsletter.use-case"

const HEADERS = new Headers()
const TOKEN = "b".repeat(NEWSLETTER_TOKEN_LENGTH)
const SINGLE_CALL = 1

const dbMocks = vi.hoisted(() => {
  const where = vi.fn<() => Promise<void>>().mockResolvedValue()
  const set = vi.fn<() => { where: typeof where }>().mockReturnValue({ where })
  const updateMock = vi.fn<() => { set: typeof set }>().mockReturnValue({ set })

  return { set, updateMock, where }
})

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

vi.mock(import("server-only"), () => ({}))

vi.mock(import("~/src/integrations/redis/redis.config"), () => ({ redis: redisMocks }))

vi.mock(import("~/src/platform/db/client"), async (importOriginal) => {
  const actual = await importOriginal()
  return { ...actual, db: Object.assign(actual.db, { update: dbMocks.updateMock }) }
})

vi.mock(
  import("next/headers"),
  (): Partial<typeof NextHeadersModule> => ({
    headers: vi.fn<() => Promise<Headers>>(() => Promise.resolve(HEADERS)),
  }),
)

describe("unsubscribe-from-newsletter", () => {
  it("marks the row unsubscribed without a session", async () => {
    expect.hasAssertions()
    dbMocks.updateMock.mockClear()

    await expect(unsubscribeFromNewsletter({ token: TOKEN })).resolves.toMatchObject({
      data: { unsubscribed: true },
    })

    expect(dbMocks.updateMock).toHaveBeenCalledTimes(SINGLE_CALL)
    expect(dbMocks.set).toHaveBeenCalledWith(expect.objectContaining({ status: "unsubscribed" }))
  })

  it("reports success for a token that matches nothing", async () => {
    expect.hasAssertions()
    dbMocks.updateMock.mockClear()

    await expect(unsubscribeFromNewsletter({ token: "c".repeat(NEWSLETTER_TOKEN_LENGTH) })).resolves.toMatchObject({
      data: { unsubscribed: true },
    })
  })

  it("rejects a token of the wrong length before it reaches a query", async () => {
    expect.hasAssertions()
    dbMocks.updateMock.mockClear()

    const result = await unsubscribeFromNewsletter({ token: "short" })

    expect(result.validationErrors).toBeDefined()
    expect(dbMocks.updateMock).not.toHaveBeenCalled()
  })
})
