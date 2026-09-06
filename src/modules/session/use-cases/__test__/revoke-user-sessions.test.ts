import type * as StartServerModule from "@tanstack/react-start/server"
import { describe, expect, it, vi } from "vite-plus/test"

import { executeMutation } from "~/src/platform/testing/lib/query"

import { createAuthSessionFixture } from "~/src/integrations/better-auth/__test__/fixtures/auth.session.fixture"
import { ROLE_CODES } from "~/src/integrations/better-auth/auth.access"
import type { auth } from "~/src/integrations/better-auth/auth.server"
import * as authServer from "~/src/integrations/better-auth/auth.server"

import { revokeUserSessionsMutation } from "~/src/modules/session/use-cases/revoke-user-sessions"

const HEADERS = new Headers()
const TARGET_USER_ID = "01900000-0000-7000-8000-000000000002"
const ADMIN_USER_ID = "01900000-0000-7000-8000-000000000001"

type AuthApi = typeof auth.api

const getSessionMock = vi.hoisted(() => vi.fn<AuthApi["getSession"]>())
const revokeUserSessionsMock = vi.hoisted(() => vi.fn<AuthApi["revokeUserSessions"]>())

vi.mock(import("@tanstack/react-start/server-only"), () => ({}))

vi.mock(import("@tanstack/react-start/server"), (): Partial<typeof StartServerModule> => ({
  getRequest: vi.fn(() => new Request("http://127.0.0.1:3000/", { headers: HEADERS })),
}))

describe("revoke-user-sessions", () => {
  it("revokes all sessions when the caller is an admin", async () => {
    expect.hasAssertions()
    getSessionMock.mockReset()
    revokeUserSessionsMock.mockReset()
    vi.spyOn(authServer.auth.api, "getSession").mockImplementation(getSessionMock)
    vi.spyOn(authServer.auth.api, "revokeUserSessions").mockImplementation(revokeUserSessionsMock)
    getSessionMock.mockResolvedValue(createAuthSessionFixture({ role: ROLE_CODES.ADMIN, userId: ADMIN_USER_ID }))
    const revokeResult = { success: true }
    revokeUserSessionsMock.mockResolvedValue(revokeResult)

    await expect(executeMutation(revokeUserSessionsMutation, { userId: TARGET_USER_ID })).resolves.toMatchObject(revokeResult)
    expect(revokeUserSessionsMock).toHaveBeenCalledWith({
      body: { userId: TARGET_USER_ID },
      headers: HEADERS,
    })
  })

  it("returns a domain error when the caller is not an admin", async () => {
    expect.hasAssertions()
    getSessionMock.mockReset()
    vi.spyOn(authServer.auth.api, "getSession").mockImplementation(getSessionMock)
    getSessionMock.mockResolvedValue(createAuthSessionFixture({ role: ROLE_CODES.CUSTOMER, userId: ADMIN_USER_ID }))

    await expect(executeMutation(revokeUserSessionsMutation, { userId: TARGET_USER_ID })).rejects.toThrow("FORBIDDEN")
  })
})
