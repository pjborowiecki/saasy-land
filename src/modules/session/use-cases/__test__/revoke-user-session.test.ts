import type * as StartServerModule from "@tanstack/react-start/server"
import { describe, expect, it, vi } from "vite-plus/test"

import { executeMutation } from "~/src/platform/testing/lib/query"

import { createAuthSessionFixture } from "~/src/integrations/better-auth/__test__/fixtures/auth.session.fixture"
import { ROLE_CODES } from "~/src/integrations/better-auth/auth.access"
import type { auth } from "~/src/integrations/better-auth/auth.server"
import * as authServer from "~/src/integrations/better-auth/auth.server"

import { revokeUserSessionMutation } from "~/src/modules/session/use-cases/revoke-user-session"

const HEADERS = new Headers()
const ADMIN_USER_ID = "01900000-0000-7000-8000-000000000001"
const SESSION_TOKEN = "target-session-token"

type AuthApi = typeof auth.api

const getSessionMock = vi.hoisted(() => vi.fn<AuthApi["getSession"]>())
const revokeUserSessionMock = vi.hoisted(() => vi.fn<AuthApi["revokeUserSession"]>())

vi.mock(import("@tanstack/react-start/server-only"), () => ({}))

vi.mock(import("@tanstack/react-start/server"), (): Partial<typeof StartServerModule> => ({
  getRequest: vi.fn(() => new Request("http://127.0.0.1:3000/", { headers: HEADERS })),
}))

describe("revoke-user-session", () => {
  it("revokes a session when the caller is an admin", async () => {
    expect.hasAssertions()
    getSessionMock.mockReset()
    revokeUserSessionMock.mockReset()
    vi.spyOn(authServer.auth.api, "getSession").mockImplementation(getSessionMock)
    vi.spyOn(authServer.auth.api, "revokeUserSession").mockImplementation(revokeUserSessionMock)
    getSessionMock.mockResolvedValue(createAuthSessionFixture({ role: ROLE_CODES.ADMIN, userId: ADMIN_USER_ID }))
    const revokeResult = { success: true }
    revokeUserSessionMock.mockResolvedValue(revokeResult)

    await expect(executeMutation(revokeUserSessionMutation, { sessionToken: SESSION_TOKEN })).resolves.toMatchObject(revokeResult)
    expect(revokeUserSessionMock).toHaveBeenCalledWith({
      body: { sessionToken: SESSION_TOKEN },
      headers: HEADERS,
    })
  })

  it("returns a domain error when the caller is not an admin", async () => {
    expect.hasAssertions()
    getSessionMock.mockReset()
    vi.spyOn(authServer.auth.api, "getSession").mockImplementation(getSessionMock)
    getSessionMock.mockResolvedValue(createAuthSessionFixture({ role: ROLE_CODES.CUSTOMER, userId: ADMIN_USER_ID }))

    await expect(executeMutation(revokeUserSessionMutation, { sessionToken: SESSION_TOKEN })).rejects.toThrow("FORBIDDEN")
  })
})
