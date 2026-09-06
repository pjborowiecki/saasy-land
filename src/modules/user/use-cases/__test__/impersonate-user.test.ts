import type * as StartServerModule from "@tanstack/react-start/server"
import { describe, expect, it, vi } from "vite-plus/test"

import { executeMutation } from "~/src/platform/testing/lib/query"

import {
  createAuthSessionFixture,
  createAuthUserMutationResult,
} from "~/src/integrations/better-auth/__test__/fixtures/auth.session.fixture"
import { ROLE_CODES } from "~/src/integrations/better-auth/auth.access"
import type { auth } from "~/src/integrations/better-auth/auth.server"
import * as authServer from "~/src/integrations/better-auth/auth.server"

import { impersonateUserMutation } from "~/src/modules/user/use-cases/impersonate-user"

const HEADERS = new Headers()
const TARGET_USER_ID = "01900000-0000-7000-8000-000000000002"
const ADMIN_USER_ID = "01900000-0000-7000-8000-000000000001"
const FIXTURE_DATE = new Date("2024-01-01T00:00:00.000Z")

type AuthApi = typeof auth.api

const getSessionMock = vi.hoisted(() => vi.fn<AuthApi["getSession"]>())
const impersonateUserMock = vi.hoisted(() => vi.fn<AuthApi["impersonateUser"]>())

vi.mock(import("@tanstack/react-start/server-only"), () => ({}))

vi.mock(import("@tanstack/react-start/server"), (): Partial<typeof StartServerModule> => ({
  getRequest: vi.fn(() => new Request("http://127.0.0.1:3000/", { headers: HEADERS })),
}))

describe("impersonate-user", () => {
  it("impersonates a user when the caller is an admin", async () => {
    expect.hasAssertions()
    getSessionMock.mockReset()
    impersonateUserMock.mockReset()
    vi.spyOn(authServer.auth.api, "getSession").mockImplementation(getSessionMock)
    vi.spyOn(authServer.auth.api, "impersonateUser").mockImplementation(impersonateUserMock)
    getSessionMock.mockResolvedValue(createAuthSessionFixture({ role: ROLE_CODES.ADMIN, userId: ADMIN_USER_ID }))
    const impersonationResult = {
      session: {
        createdAt: FIXTURE_DATE,
        expiresAt: FIXTURE_DATE,
        id: "01900000-0000-7000-8000-000000000003",
        token: "impersonated-session-token",
        updatedAt: FIXTURE_DATE,
        userId: TARGET_USER_ID,
      },
      user: createAuthUserMutationResult({ userId: TARGET_USER_ID }).user,
    }
    impersonateUserMock.mockResolvedValue(impersonationResult)

    await expect(executeMutation(impersonateUserMutation, { userId: TARGET_USER_ID })).resolves.toMatchObject(impersonationResult)
    expect(impersonateUserMock).toHaveBeenCalledWith({
      body: { userId: TARGET_USER_ID },
      headers: HEADERS,
    })
  })

  it("returns a domain error when the caller is not an admin", async () => {
    expect.hasAssertions()
    getSessionMock.mockReset()
    vi.spyOn(authServer.auth.api, "getSession").mockImplementation(getSessionMock)
    getSessionMock.mockResolvedValue(createAuthSessionFixture({ role: ROLE_CODES.CUSTOMER, userId: ADMIN_USER_ID }))

    await expect(executeMutation(impersonateUserMutation, { userId: TARGET_USER_ID })).rejects.toThrow("FORBIDDEN")
  })
})
