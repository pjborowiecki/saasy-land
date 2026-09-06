import type * as StartServerModule from "@tanstack/react-start/server"
import { describe, expect, it, vi } from "vite-plus/test"

import { executeMutation } from "~/src/platform/testing/lib/query"

import {
  createAuthSessionFixture,
  createMissingAuthSessionResult,
} from "~/src/integrations/better-auth/__test__/fixtures/auth.session.fixture"
import { ROLE_CODES } from "~/src/integrations/better-auth/auth.access"
import type { auth } from "~/src/integrations/better-auth/auth.server"
import * as authServer from "~/src/integrations/better-auth/auth.server"

import { settingsRevokeSessionMutation } from "~/src/modules/session/use-cases/revoke-session"

const HEADERS = new Headers()
const USER_ID = "01900000-0000-7000-8000-000000000001"

type AuthApi = typeof auth.api

const getSessionMock = vi.hoisted(() => vi.fn<AuthApi["getSession"]>())
const revokeSessionMock = vi.hoisted(() => vi.fn<AuthApi["revokeSession"]>())

vi.mock(import("@tanstack/react-start/server-only"), () => ({}))

vi.mock(import("@tanstack/react-start/server"), (): Partial<typeof StartServerModule> => ({
  getRequest: vi.fn(() => new Request("http://127.0.0.1:3000/", { headers: HEADERS })),
}))

describe("revoke-session", () => {
  it("revokes one session for admins", async () => {
    expect.hasAssertions()
    getSessionMock.mockReset()
    revokeSessionMock.mockReset()
    vi.spyOn(authServer.auth.api, "getSession").mockImplementation(getSessionMock)
    vi.spyOn(authServer.auth.api, "revokeSession").mockImplementation(revokeSessionMock)
    getSessionMock.mockResolvedValue(createAuthSessionFixture({ role: ROLE_CODES.ADMIN, userId: USER_ID }))
    revokeSessionMock.mockResolvedValue({ status: true })

    await expect(executeMutation(settingsRevokeSessionMutation, { token: "token-1" })).resolves.toMatchObject({ status: true })
  })

  it("returns a domain error when the caller is signed out", async () => {
    expect.hasAssertions()
    getSessionMock.mockReset()
    vi.spyOn(authServer.auth.api, "getSession").mockImplementation(getSessionMock)
    getSessionMock.mockResolvedValue(createMissingAuthSessionResult())

    await expect(executeMutation(settingsRevokeSessionMutation, { token: "token-1" })).rejects.toThrow("UNAUTHORIZED")
  })
})
