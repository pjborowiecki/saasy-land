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

import { stopImpersonatingUserMutation } from "~/src/modules/user/use-cases/stop-impersonating-user"

const HEADERS = new Headers()
const ADMIN_USER_ID = "01900000-0000-7000-8000-000000000001"
const FIXTURE_DATE = new Date("2024-01-01T00:00:00.000Z")

type AuthApi = typeof auth.api

const getSessionMock = vi.hoisted(() => vi.fn<AuthApi["getSession"]>())
const stopImpersonatingMock = vi.hoisted(() => vi.fn<AuthApi["stopImpersonating"]>())

vi.mock(import("@tanstack/react-start/server-only"), () => ({}))

vi.mock(import("@tanstack/react-start/server"), (): Partial<typeof StartServerModule> => ({
  getRequest: vi.fn(() => new Request("http://127.0.0.1:3000/", { headers: HEADERS })),
}))

describe("stop-impersonating-user", () => {
  it("stops impersonating when the caller is an admin", async () => {
    expect.hasAssertions()
    getSessionMock.mockReset()
    stopImpersonatingMock.mockReset()
    vi.spyOn(authServer.auth.api, "getSession").mockImplementation(getSessionMock)
    vi.spyOn(authServer.auth.api, "stopImpersonating").mockImplementation(stopImpersonatingMock)
    getSessionMock.mockResolvedValue(createAuthSessionFixture({ role: ROLE_CODES.ADMIN, userId: ADMIN_USER_ID }))
    const stopResult = {
      session: {
        createdAt: FIXTURE_DATE,
        expiresAt: FIXTURE_DATE,
        id: "01900000-0000-7000-8000-000000000003",
        token: "admin-session-token",
        updatedAt: FIXTURE_DATE,
        userId: ADMIN_USER_ID,
      },
      user: createAuthSessionFixture({ role: ROLE_CODES.ADMIN, userId: ADMIN_USER_ID }).user,
    }
    stopImpersonatingMock.mockResolvedValue(stopResult)

    await expect(executeMutation(stopImpersonatingUserMutation, undefined)).resolves.toMatchObject(stopResult)
    expect(stopImpersonatingMock).toHaveBeenCalledWith({ headers: HEADERS })
  })

  it("returns a domain error when the caller is not signed in", async () => {
    expect.hasAssertions()
    getSessionMock.mockReset()
    vi.spyOn(authServer.auth.api, "getSession").mockImplementation(getSessionMock)
    getSessionMock.mockResolvedValue(createMissingAuthSessionResult())

    await expect(executeMutation(stopImpersonatingUserMutation, undefined)).rejects.toThrow("UNAUTHORIZED")
  })
})
