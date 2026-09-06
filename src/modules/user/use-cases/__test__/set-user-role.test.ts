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

import { setUserRoleMutation } from "~/src/modules/user/use-cases/set-user-role"

const HEADERS = new Headers()
const TARGET_USER_ID = "01900000-0000-7000-8000-000000000002"
const ADMIN_USER_ID = "01900000-0000-7000-8000-000000000001"

type AuthApi = typeof auth.api

const getSessionMock = vi.hoisted(() => vi.fn<AuthApi["getSession"]>())
const setRoleMock = vi.hoisted(() => vi.fn<AuthApi["setRole"]>())

vi.mock(import("@tanstack/react-start/server-only"), () => ({}))

vi.mock(import("@tanstack/react-start/server"), (): Partial<typeof StartServerModule> => ({
  getRequest: vi.fn(() => new Request("http://127.0.0.1:3000/", { headers: HEADERS })),
}))

describe("set-user-role", () => {
  it("sets a user role when the caller is an admin", async () => {
    expect.hasAssertions()
    getSessionMock.mockReset()
    setRoleMock.mockReset()
    vi.spyOn(authServer.auth.api, "getSession").mockImplementation(getSessionMock)
    vi.spyOn(authServer.auth.api, "setRole").mockImplementation(setRoleMock)
    getSessionMock.mockResolvedValue(createAuthSessionFixture({ role: ROLE_CODES.ADMIN, userId: ADMIN_USER_ID }))
    const mutationResult = createAuthUserMutationResult({ role: ROLE_CODES.CUSTOMER, userId: TARGET_USER_ID })
    setRoleMock.mockResolvedValue(mutationResult)

    await expect(executeMutation(setUserRoleMutation, { role: ROLE_CODES.CUSTOMER, userId: TARGET_USER_ID })).resolves.toMatchObject(
      mutationResult,
    )
  })
})
