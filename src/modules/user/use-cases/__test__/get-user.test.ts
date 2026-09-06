import type * as StartServerModule from "@tanstack/react-start/server"
import { describe, expect, it, vi } from "vite-plus/test"

import {
  createAuthSessionFixture,
  createAuthUserMutationResult,
  createMissingAuthSessionResult,
} from "~/src/integrations/better-auth/__test__/fixtures/auth.session.fixture"
import { ROLE_CODES } from "~/src/integrations/better-auth/auth.access"
import type { auth } from "~/src/integrations/better-auth/auth.server"
import * as authServer from "~/src/integrations/better-auth/auth.server"

import { getUser } from "~/src/modules/user/use-cases/get-user"

const HEADERS = new Headers()
const TARGET_USER_ID = "01900000-0000-7000-8000-000000000002"
const ADMIN_USER_ID = "01900000-0000-7000-8000-000000000001"

type AuthApi = typeof auth.api

const getSessionMock = vi.hoisted(() => vi.fn<AuthApi["getSession"]>())
const getUserMock = vi.hoisted(() => vi.fn<AuthApi["getUser"]>())

vi.mock(import("@tanstack/react-start/server-only"), () => ({}))

vi.mock(import("@tanstack/react-start/server"), (): Partial<typeof StartServerModule> => ({
  getRequest: vi.fn(() => new Request("http://127.0.0.1:3000/", { headers: HEADERS })),
}))

describe("get-user", () => {
  it("fetches a user when the caller is an admin", async () => {
    expect.hasAssertions()
    getSessionMock.mockReset()
    getUserMock.mockReset()
    vi.spyOn(authServer.auth.api, "getSession").mockImplementation(getSessionMock)
    vi.spyOn(authServer.auth.api, "getUser").mockImplementation(getUserMock)
    getSessionMock.mockResolvedValue(createAuthSessionFixture({ role: ROLE_CODES.ADMIN, userId: ADMIN_USER_ID }))
    const userResult = createAuthUserMutationResult({ userId: TARGET_USER_ID }).user
    getUserMock.mockResolvedValue(userResult)

    await expect(getUser({ data: TARGET_USER_ID })).resolves.toMatchObject(userResult)
    expect(getUserMock).toHaveBeenCalledWith({
      headers: HEADERS,
      query: { id: TARGET_USER_ID },
    })
  })

  it("rejects when the caller is not an admin", async () => {
    expect.hasAssertions()
    getSessionMock.mockReset()
    vi.spyOn(authServer.auth.api, "getSession").mockImplementation(getSessionMock)
    getSessionMock.mockResolvedValue(createAuthSessionFixture({ role: ROLE_CODES.CUSTOMER, userId: ADMIN_USER_ID }))

    await expect(getUser({ data: TARGET_USER_ID })).rejects.toMatchObject({ code: "FORBIDDEN" })
  })

  it("rejects when the caller is signed out", async () => {
    expect.hasAssertions()
    getSessionMock.mockReset()
    vi.spyOn(authServer.auth.api, "getSession").mockImplementation(getSessionMock)
    getSessionMock.mockResolvedValue(createMissingAuthSessionResult())

    await expect(getUser({ data: TARGET_USER_ID })).rejects.toMatchObject({ code: "UNAUTHORIZED" })
  })
})
