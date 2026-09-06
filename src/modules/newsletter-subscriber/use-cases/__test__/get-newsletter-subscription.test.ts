import type * as StartServerModule from "@tanstack/react-start/server"
import { describe, expect, it, vi } from "vite-plus/test"

import { JSON_NULL } from "~/src/platform/testing/lib/json-null"
import { executeQuery } from "~/src/platform/testing/lib/query"

import { createAuthSessionFixture } from "~/src/integrations/better-auth/__test__/fixtures/auth.session.fixture"
import { ROLE_CODES } from "~/src/integrations/better-auth/auth.access"
import type { auth } from "~/src/integrations/better-auth/auth.server"
import * as authServer from "~/src/integrations/better-auth/auth.server"

import { getNewsletterSubscriptionQuery } from "~/src/modules/newsletter-subscriber/use-cases/get-newsletter-subscription"

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

vi.mock(import("@tanstack/react-start/server-only"), () => ({}))

vi.mock(import("~/src/integrations/drizzle-orm/drizzle.database"), async (importOriginal) => {
  const actual = await importOriginal()
  return { ...actual, db: Object.assign(actual.db, { select: dbMocks.selectMock }) }
})

vi.mock(import("@tanstack/react-start/server"), (): Partial<typeof StartServerModule> => ({
  getRequest: vi.fn(() => new Request("http://127.0.0.1:3000/", { headers: HEADERS })),
}))

const signedIn = (): void => {
  getSessionMock.mockReset()
  vi.spyOn(authServer.auth.api, "getSession").mockImplementation(getSessionMock)
  getSessionMock.mockResolvedValue(createAuthSessionFixture({ role: ROLE_CODES.CUSTOMER, userId: USER_ID }))
}

describe("get-newsletter-subscription", () => {
  it("reports subscribed when the session address is on the list", async () => {
    expect.hasAssertions()
    signedIn()
    dbMocks.limit.mockResolvedValue([{ status: "subscribed" }])

    await expect(executeQuery(getNewsletterSubscriptionQuery)).resolves.toMatchObject({ isSubscribed: true })
  })

  it("reports unsubscribed when the row was opted out", async () => {
    expect.hasAssertions()
    signedIn()
    dbMocks.limit.mockResolvedValue([{ status: "unsubscribed" }])

    await expect(executeQuery(getNewsletterSubscriptionQuery)).resolves.toMatchObject({ isSubscribed: false })
  })

  it("reports unsubscribed when the account never signed up", async () => {
    expect.hasAssertions()
    signedIn()
    dbMocks.limit.mockResolvedValue([])

    await expect(executeQuery(getNewsletterSubscriptionQuery)).resolves.toMatchObject({ isSubscribed: false })
  })

  it("refuses a caller with no session", async () => {
    expect.hasAssertions()
    getSessionMock.mockReset()
    vi.spyOn(authServer.auth.api, "getSession").mockImplementation(getSessionMock)
    getSessionMock.mockResolvedValue(JSON_NULL)

    await expect(executeQuery(getNewsletterSubscriptionQuery)).rejects.toThrow("UNAUTHORIZED")
  })
})
