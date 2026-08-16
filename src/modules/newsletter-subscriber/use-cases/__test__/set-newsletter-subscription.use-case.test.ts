import type * as NextHeadersModule from "next/headers"

import { JSON_NULL } from "~/src/platform/testing/lib/json-null"

import { setNewsletterSubscription } from "~/src/modules/newsletter-subscriber/use-cases/set-newsletter-subscription.use-case"

import { createAuthSessionFixture } from "~/src/integrations/better-auth/__test__/fixtures/auth.session.fixture"
import { ROLE_CODES } from "~/src/integrations/better-auth/auth.access"
import type { auth } from "~/src/integrations/better-auth/auth.server"
import * as authServer from "~/src/integrations/better-auth/auth.server"

const HEADERS = new Headers()
const USER_ID = "01900000-0000-7000-8000-000000000001"
const SINGLE_CALL = 1

type AuthApi = typeof auth.api

const getSessionMock = vi.hoisted(() => vi.fn<AuthApi["getSession"]>())

const dbMocks = vi.hoisted(() => {
  const updateWhere = vi.fn<() => Promise<void>>().mockResolvedValue()
  const set = vi.fn<() => { where: typeof updateWhere }>().mockReturnValue({ where: updateWhere })
  const updateMock = vi.fn<() => { set: typeof set }>().mockReturnValue({ set })

  const onConflictDoUpdate = vi.fn<() => Promise<void>>().mockResolvedValue()
  const values = vi.fn<() => { onConflictDoUpdate: typeof onConflictDoUpdate }>().mockReturnValue({ onConflictDoUpdate })
  const insertMock = vi.fn<() => { values: typeof values }>().mockReturnValue({ values })

  return { insertMock, onConflictDoUpdate, set, updateMock, values }
})

vi.mock(import("server-only"), () => ({}))

vi.mock(import("~/src/platform/db/client"), async (importOriginal) => {
  const actual = await importOriginal()
  return { ...actual, db: Object.assign(actual.db, { insert: dbMocks.insertMock, update: dbMocks.updateMock }) }
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
  dbMocks.insertMock.mockClear()
  dbMocks.updateMock.mockClear()
}

describe("set-newsletter-subscription", () => {
  it("adds the session address to the list", async () => {
    expect.hasAssertions()
    signedIn()

    await expect(setNewsletterSubscription({ isSubscribed: true, locale: "en-US" })).resolves.toMatchObject({
      data: { isSubscribed: true },
    })

    expect(dbMocks.insertMock).toHaveBeenCalledTimes(SINGLE_CALL)
    expect(dbMocks.values).toHaveBeenCalledWith(expect.objectContaining({ source: "app" }))
  })

  it("takes the session address off the list", async () => {
    expect.hasAssertions()
    signedIn()

    await expect(setNewsletterSubscription({ isSubscribed: false, locale: "en-US" })).resolves.toMatchObject({
      data: { isSubscribed: false },
    })

    expect(dbMocks.updateMock).toHaveBeenCalledTimes(SINGLE_CALL)
    expect(dbMocks.insertMock).not.toHaveBeenCalled()
    expect(dbMocks.set).toHaveBeenCalledWith(expect.objectContaining({ status: "unsubscribed" }))
  })

  it("refuses a caller with no session", async () => {
    expect.hasAssertions()
    getSessionMock.mockReset()
    vi.spyOn(authServer.auth.api, "getSession").mockImplementation(getSessionMock)
    getSessionMock.mockResolvedValue(JSON_NULL)

    await expect(setNewsletterSubscription({ isSubscribed: true, locale: "en-US" })).resolves.toMatchObject({
      serverError: { code: "UNAUTHORIZED" },
    })
  })
})
