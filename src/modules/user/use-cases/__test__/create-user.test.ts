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

import { createUserMutation } from "~/src/modules/user/use-cases/create-user"

const HEADERS = new Headers()
const ADMIN_USER_ID = "01900000-0000-7000-8000-000000000001"

type AuthApi = typeof auth.api

const getSessionMock = vi.hoisted(() => vi.fn<AuthApi["getSession"]>())
const createUserMock = vi.hoisted(() => vi.fn<AuthApi["createUser"]>())

vi.mock(import("@tanstack/react-start/server-only"), () => ({}))

vi.mock(import("@tanstack/react-start/server"), (): Partial<typeof StartServerModule> => ({
  getRequest: vi.fn(() => new Request("http://127.0.0.1:3000/", { headers: HEADERS })),
}))

describe("create-user", () => {
  it("creates a user when the caller is an admin", async () => {
    expect.hasAssertions()
    getSessionMock.mockReset()
    createUserMock.mockReset()
    vi.spyOn(authServer.auth.api, "getSession").mockImplementation(getSessionMock)
    vi.spyOn(authServer.auth.api, "createUser").mockImplementation(createUserMock)
    getSessionMock.mockResolvedValue(createAuthSessionFixture({ role: ROLE_CODES.ADMIN, userId: ADMIN_USER_ID }))
    const mutationResult = createAuthUserMutationResult()
    createUserMock.mockResolvedValue(mutationResult)

    await expect(
      executeMutation(createUserMutation, {
        email: "new@example.com",
        name: "New User",
        password: "Password1!",
      }),
    ).resolves.toMatchObject(mutationResult)

    expect(createUserMock).toHaveBeenCalledWith({
      body: {
        email: "new@example.com",
        name: "New User",
        password: "Password1!",
      },
      headers: HEADERS,
    })
  })

  it("returns a domain error when the caller is not an admin", async () => {
    expect.hasAssertions()
    getSessionMock.mockReset()
    vi.spyOn(authServer.auth.api, "getSession").mockImplementation(getSessionMock)
    getSessionMock.mockResolvedValue(createAuthSessionFixture({ role: ROLE_CODES.CUSTOMER, userId: ADMIN_USER_ID }))

    await expect(
      executeMutation(createUserMutation, {
        email: "new@example.com",
        name: "New User",
      }),
    ).rejects.toThrow("FORBIDDEN")
  })
})
