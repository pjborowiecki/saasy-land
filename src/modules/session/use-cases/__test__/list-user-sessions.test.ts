import { QueryClient } from "@tanstack/react-query"
import type * as StartServerModule from "@tanstack/react-start/server"
import { describe, expect, it, vi } from "vite-plus/test"

import { executeQuery } from "~/src/platform/testing/lib/query"

import { createAuthSessionFixture } from "~/src/integrations/better-auth/__test__/fixtures/auth.session.fixture"
import { ROLE_CODES } from "~/src/integrations/better-auth/auth.access"
import type { auth } from "~/src/integrations/better-auth/auth.server"
import * as authServer from "~/src/integrations/better-auth/auth.server"

import { listUserSessionsQuery } from "~/src/modules/session/use-cases/list-user-sessions"

const HEADERS = new Headers()
const TARGET_USER_ID = "01900000-0000-7000-8000-000000000002"
const OTHER_TARGET_USER_ID = "01900000-0000-7000-8000-000000000004"
const ADMIN_USER_ID = "01900000-0000-7000-8000-000000000001"
const FIXTURE_DATE = new Date("2024-01-01T00:00:00.000Z")

type AuthApi = typeof auth.api

const getSessionMock = vi.hoisted(() => vi.fn<AuthApi["getSession"]>())
const listUserSessionsMock = vi.hoisted(() => vi.fn<AuthApi["listUserSessions"]>())

vi.mock(import("@tanstack/react-start/server-only"), () => ({}))

vi.mock(import("@tanstack/react-start/server"), (): Partial<typeof StartServerModule> => ({
  getRequest: vi.fn(() => new Request("http://127.0.0.1:3000/", { headers: HEADERS })),
}))

describe("list-user-sessions", () => {
  it("lists sessions when the caller is an admin", async () => {
    expect.hasAssertions()
    getSessionMock.mockReset()
    listUserSessionsMock.mockReset()
    vi.spyOn(authServer.auth.api, "getSession").mockImplementation(getSessionMock)
    vi.spyOn(authServer.auth.api, "listUserSessions").mockImplementation(listUserSessionsMock)
    getSessionMock.mockResolvedValue(createAuthSessionFixture({ role: ROLE_CODES.ADMIN, userId: ADMIN_USER_ID }))
    const sessionsResult = {
      sessions: [
        {
          createdAt: FIXTURE_DATE,
          expiresAt: FIXTURE_DATE,
          id: "01900000-0000-7000-8000-000000000003",
          token: "session-token",
          updatedAt: FIXTURE_DATE,
          userId: TARGET_USER_ID,
        },
      ],
    }
    listUserSessionsMock.mockResolvedValue(sessionsResult)

    await expect(executeQuery(listUserSessionsQuery({ userId: TARGET_USER_ID }))).resolves.toMatchObject(sessionsResult)
    expect(listUserSessionsMock).toHaveBeenCalledWith({
      body: { userId: TARGET_USER_ID },
      headers: HEADERS,
    })
  })

  it("isolates target users in one cache and reuses a fresh result for the same user", async () => {
    getSessionMock.mockReset()
    listUserSessionsMock.mockReset()
    vi.spyOn(authServer.auth.api, "getSession").mockImplementation(getSessionMock)
    vi.spyOn(authServer.auth.api, "listUserSessions").mockImplementation(listUserSessionsMock)
    getSessionMock.mockResolvedValue(createAuthSessionFixture({ role: ROLE_CODES.ADMIN, userId: ADMIN_USER_ID }))
    const firstResult = { sessions: [] }
    const secondResult = {
      sessions: [
        {
          createdAt: FIXTURE_DATE,
          expiresAt: FIXTURE_DATE,
          id: "01900000-0000-7000-8000-000000000005",
          token: "other-session-token",
          updatedAt: FIXTURE_DATE,
          userId: OTHER_TARGET_USER_ID,
        },
      ],
    }
    listUserSessionsMock.mockResolvedValueOnce(firstResult).mockResolvedValueOnce(secondResult)
    const queryClient = new QueryClient({ defaultOptions: { queries: { retry: false, staleTime: Infinity } } })

    await expect(queryClient.query(listUserSessionsQuery({ userId: TARGET_USER_ID }))).resolves.toEqual(firstResult)
    await expect(queryClient.query(listUserSessionsQuery({ userId: OTHER_TARGET_USER_ID }))).resolves.toEqual(secondResult)
    await expect(queryClient.query(listUserSessionsQuery({ userId: TARGET_USER_ID }))).resolves.toEqual(firstResult)

    expect(listUserSessionsMock).toHaveBeenCalledTimes(2)
    expect(listUserSessionsMock).toHaveBeenNthCalledWith(1, { body: { userId: TARGET_USER_ID }, headers: HEADERS })
    expect(listUserSessionsMock).toHaveBeenNthCalledWith(2, { body: { userId: OTHER_TARGET_USER_ID }, headers: HEADERS })
    expect(queryClient.getQueryData(listUserSessionsQuery({ userId: TARGET_USER_ID }).queryKey)).toEqual(firstResult)
    expect(queryClient.getQueryData(listUserSessionsQuery({ userId: OTHER_TARGET_USER_ID }).queryKey)).toEqual(secondResult)
  })

  it("returns a domain error when the caller is not an admin", async () => {
    expect.hasAssertions()
    getSessionMock.mockReset()
    vi.spyOn(authServer.auth.api, "getSession").mockImplementation(getSessionMock)
    getSessionMock.mockResolvedValue(createAuthSessionFixture({ role: ROLE_CODES.CUSTOMER, userId: ADMIN_USER_ID }))

    await expect(executeQuery(listUserSessionsQuery({ userId: TARGET_USER_ID }))).rejects.toThrow("FORBIDDEN")
  })
})
