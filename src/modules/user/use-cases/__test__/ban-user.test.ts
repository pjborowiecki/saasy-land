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

import { banUserMutation } from "~/src/modules/user/use-cases/ban-user"

const HEADERS = new Headers()
const TARGET_USER_ID = "01900000-0000-7000-8000-000000000002"
const ADMIN_USER_ID = "01900000-0000-7000-8000-000000000001"

type AuthApi = typeof auth.api

const getSessionMock = vi.hoisted(() => vi.fn<AuthApi["getSession"]>())
const banUserMock = vi.hoisted(() => vi.fn<AuthApi["banUser"]>())

vi.mock(import("@tanstack/react-start/server-only"), () => ({}))

vi.mock(import("@tanstack/react-start/server"), (): Partial<typeof StartServerModule> => ({
  getRequest: vi.fn(() => new Request("http://127.0.0.1:3000/", { headers: HEADERS })),
}))

describe("ban-user", () => {
  it("bans a user when the caller is an admin", async () => {
    expect.hasAssertions()
    getSessionMock.mockReset()
    banUserMock.mockReset()
    vi.spyOn(authServer.auth.api, "getSession").mockImplementation(getSessionMock)
    vi.spyOn(authServer.auth.api, "banUser").mockImplementation(banUserMock)
    getSessionMock.mockResolvedValue(createAuthSessionFixture({ role: ROLE_CODES.ADMIN, userId: ADMIN_USER_ID }))
    const mutationResult = createAuthUserMutationResult({ userId: TARGET_USER_ID })
    banUserMock.mockResolvedValue(mutationResult)

    await expect(executeMutation(banUserMutation, { banReason: "spam", userId: TARGET_USER_ID })).resolves.toMatchObject(mutationResult)
    expect(banUserMock).toHaveBeenCalledWith({
      body: { banReason: "spam", userId: TARGET_USER_ID },
      headers: HEADERS,
    })
  })

  it("returns a domain error when the caller is not an admin", async () => {
    expect.hasAssertions()
    getSessionMock.mockReset()
    vi.spyOn(authServer.auth.api, "getSession").mockImplementation(getSessionMock)
    getSessionMock.mockResolvedValue(createAuthSessionFixture({ role: ROLE_CODES.CUSTOMER, userId: ADMIN_USER_ID }))

    await expect(executeMutation(banUserMutation, { userId: TARGET_USER_ID })).rejects.toThrow("FORBIDDEN")
  })
})
