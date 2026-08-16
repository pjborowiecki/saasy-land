import type * as NextHeadersModule from "next/headers"

import { JSON_NULL } from "~/src/platform/testing/lib/json-null"

import { getNewsletterSubscription } from "~/src/modules/newsletter-subscriber/use-cases/get-newsletter-subscription.use-case"

import { createAuthSessionFixture } from "~/src/integrations/better-auth/__test__/fixtures/auth.session.fixture"
import { ROLE_CODES } from "~/src/integrations/better-auth/auth.access"
import type { auth } from "~/src/integrations/better-auth/auth.server"
import * as authServer from "~/src/integrations/better-auth/auth.server"

const HEADERS = new Headers()
const USER_ID = "01900000-0000-7000-8000-000000000001"

type AuthApi = typeof auth.api

const getSessionMock = vi.hoisted(() => vi.fn<AuthApi["getSession"]>())

const dbMocks = vi.hoisted(() => {
  const limit = vi.fn<() => Promise<{ status: string }[]>>()
  const where = vi.fn<() => { limit: typeof limit }>().mockReturnValue({ limit })
  const from = vi.fn<() => { where: typeof where }>().mockReturnValue({ where })
  const selectMock = vi.fn<() => { from: typeof from }>().mockReturnValue({ from })

  return { limit, selectMock }
})

vi.mock(import("server-only"), () => ({}))

vi.mock(import("~/src/platform/db/client"), async (importOriginal) => {
  const actual = await importOriginal()
  return { ...actual, db: Object.assign(actual.db, { select: dbMocks.selectMock }) }
})

vi.mock(
  import("next/headers"),
  (): Partial<typeof NextHeadersModule> => ({
    headers: vi.fn<() => Promise<Headers>>(() => Promise.resolve(HEADERS)),
  }),
)

function signedIn(): void {
  getSessionMock.mockReset()
  vi.spyOn(authServer.auth.api, "getSession").mockImplementation(getSessionMock)
  getSessionMock.mockResolvedValue(createAuthSessionFixture({ role: ROLE_CODES.CUSTOMER, userId: USER_ID }))
}

describe("get-newsletter-subscription", () => {
  it("reports subscribed when the session address is on the list", async () => {
    expect.hasAssertions()
    signedIn()
    dbMocks.limit.mockResolvedValue([{ status: "subscribed" }])

    await expect(getNewsletterSubscription()).resolves.toMatchObject({ data: { isSubscribed: true } })
  })

  it("reports unsubscribed when the row was opted out", async () => {
    expect.hasAssertions()
    signedIn()
    dbMocks.limit.mockResolvedValue([{ status: "unsubscribed" }])

    await expect(getNewsletterSubscription()).resolves.toMatchObject({ data: { isSubscribed: false } })
  })

  it("reports unsubscribed when the account never signed up", async () => {
    expect.hasAssertions()
    signedIn()
    dbMocks.limit.mockResolvedValue([])

    await expect(getNewsletterSubscription()).resolves.toMatchObject({ data: { isSubscribed: false } })
  })

  it("refuses a caller with no session", async () => {
    expect.hasAssertions()
    getSessionMock.mockReset()
    vi.spyOn(authServer.auth.api, "getSession").mockImplementation(getSessionMock)
    getSessionMock.mockResolvedValue(JSON_NULL)

    await expect(getNewsletterSubscription()).resolves.toMatchObject({ serverError: { code: "UNAUTHORIZED" } })
  })
})
