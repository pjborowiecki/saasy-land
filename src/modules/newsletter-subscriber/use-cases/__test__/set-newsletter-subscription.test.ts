import type * as StartServerModule from "@tanstack/react-start/server"
import { describe, expect, it, vi } from "vite-plus/test"

import { JSON_NULL } from "~/src/platform/testing/lib/json-null"
import { executeMutation } from "~/src/platform/testing/lib/query"

import { createAuthSessionFixture } from "~/src/integrations/better-auth/__test__/fixtures/auth.session.fixture"
import { ROLE_CODES } from "~/src/integrations/better-auth/auth.access"
import type { auth } from "~/src/integrations/better-auth/auth.server"
import * as authServer from "~/src/integrations/better-auth/auth.server"

import { setNewsletterSubscriptionMutation } from "~/src/modules/newsletter-subscriber/use-cases/set-newsletter-subscription"

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

vi.mock(import("@tanstack/react-start/server-only"), () => ({}))

vi.mock(import("~/src/integrations/drizzle-orm/drizzle.database"), async (importOriginal) => {
  const actual = await importOriginal()
  return { ...actual, db: Object.assign(actual.db, { insert: dbMocks.insertMock, update: dbMocks.updateMock }) }
})

vi.mock(import("@tanstack/react-start/server"), (): Partial<typeof StartServerModule> => ({
  getRequest: vi.fn(() => new Request("http://127.0.0.1:3000/", { headers: HEADERS })),
}))

const signedIn = (): void => {
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

    await expect(executeMutation(setNewsletterSubscriptionMutation, { isSubscribed: true, locale: "en-US" })).resolves.toMatchObject({
      isSubscribed: true,
    })

    expect(dbMocks.insertMock).toHaveBeenCalledTimes(SINGLE_CALL)
    expect(dbMocks.values).toHaveBeenCalledWith(expect.objectContaining({ source: "app" }))
  })

  it("takes the session address off the list", async () => {
    expect.hasAssertions()
    signedIn()

    await expect(executeMutation(setNewsletterSubscriptionMutation, { isSubscribed: false, locale: "en-US" })).resolves.toMatchObject({
      isSubscribed: false,
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

    await expect(executeMutation(setNewsletterSubscriptionMutation, { isSubscribed: true, locale: "en-US" })).rejects.toThrow(
      "UNAUTHORIZED",
    )
  })
})
