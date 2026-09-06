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

import { unbanUserMutation } from "~/src/modules/user/use-cases/unban-user"

const HEADERS = new Headers()
const TARGET_USER_ID = "01900000-0000-7000-8000-000000000002"
const ADMIN_USER_ID = "01900000-0000-7000-8000-000000000001"

type AuthApi = typeof auth.api

const getSessionMock = vi.hoisted(() => vi.fn<AuthApi["getSession"]>())
const unbanUserMock = vi.hoisted(() => vi.fn<AuthApi["unbanUser"]>())

vi.mock(import("@tanstack/react-start/server-only"), () => ({}))

vi.mock(import("@tanstack/react-start/server"), (): Partial<typeof StartServerModule> => ({
  getRequest: vi.fn(() => new Request("http://127.0.0.1:3000/", { headers: HEADERS })),
}))

describe("unban-user", () => {
  it("unbans a user when the caller is an admin", async () => {
    expect.hasAssertions()
    getSessionMock.mockReset()
    unbanUserMock.mockReset()
    vi.spyOn(authServer.auth.api, "getSession").mockImplementation(getSessionMock)
    vi.spyOn(authServer.auth.api, "unbanUser").mockImplementation(unbanUserMock)
    getSessionMock.mockResolvedValue(createAuthSessionFixture({ role: ROLE_CODES.ADMIN, userId: ADMIN_USER_ID }))
    const mutationResult = createAuthUserMutationResult({ userId: TARGET_USER_ID })
    unbanUserMock.mockResolvedValue(mutationResult)

    await expect(executeMutation(unbanUserMutation, { userId: TARGET_USER_ID })).resolves.toMatchObject(mutationResult)
  })
})
