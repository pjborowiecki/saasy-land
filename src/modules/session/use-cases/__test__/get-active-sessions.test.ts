import type * as StartServerModule from "@tanstack/react-start/server"
import { describe, expect, it, vi } from "vite-plus/test"

import { executeQuery } from "~/src/platform/testing/lib/query"

import {
  createAuthSessionFixture,
  createMissingAuthSessionResult,
} from "~/src/integrations/better-auth/__test__/fixtures/auth.session.fixture"
import { ROLE_CODES } from "~/src/integrations/better-auth/auth.access"
import type { auth } from "~/src/integrations/better-auth/auth.server"
import * as authServer from "~/src/integrations/better-auth/auth.server"

import { getActiveSessionsQuery } from "~/src/modules/session/use-cases/get-active-sessions"

const HEADERS = new Headers()
const USER_ID = "01900000-0000-7000-8000-000000000001"
const UPDATED_AT = new Date("2026-07-21T12:00:00.000Z")

type AuthApi = typeof auth.api

const getSessionMock = vi.hoisted(() => vi.fn<AuthApi["getSession"]>())
const listSessionsMock = vi.hoisted(() => vi.fn<AuthApi["listSessions"]>())

vi.mock(import("@tanstack/react-start/server-only"), () => ({}))

vi.mock(import("@tanstack/react-start/server"), (): Partial<typeof StartServerModule> => ({
  getRequest: vi.fn(() => new Request("http://127.0.0.1:3000/", { headers: HEADERS })),
}))

const resetAuthApiMocks = (): void => {
  getSessionMock.mockReset()
  listSessionsMock.mockReset()
  vi.spyOn(authServer.auth.api, "getSession").mockImplementation(getSessionMock)
  vi.spyOn(authServer.auth.api, "listSessions").mockImplementation(listSessionsMock)
}

describe("get-active-sessions", () => {
  it("lists the caller's active sessions", async () => {
    expect.hasAssertions()
    resetAuthApiMocks()
    const session = {
      createdAt: UPDATED_AT,
      expiresAt: UPDATED_AT,
      id: "session-1",
      token: "token-1",
      updatedAt: UPDATED_AT,
      userId: USER_ID,
    }
    listSessionsMock.mockResolvedValue([session])
    getSessionMock.mockResolvedValue(createAuthSessionFixture({ role: ROLE_CODES.CUSTOMER, userId: USER_ID }))

    await expect(executeQuery(getActiveSessionsQuery)).resolves.toStrictEqual([session])
    expect(listSessionsMock).toHaveBeenCalledWith({ headers: HEADERS })
  })

  it("rejects when the caller is signed out", async () => {
    expect.hasAssertions()
    resetAuthApiMocks()
    getSessionMock.mockResolvedValue(createMissingAuthSessionResult())

    await expect(executeQuery(getActiveSessionsQuery)).rejects.toMatchObject({ code: "UNAUTHORIZED" })
    expect(listSessionsMock).not.toHaveBeenCalled()
  })
})
