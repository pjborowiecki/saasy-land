import type * as StartServerModule from "@tanstack/react-start/server"
import { describe, expect, it, vi } from "vite-plus/test"

import { executeMutation } from "~/src/platform/testing/lib/query"

import {
  createAuthSessionFixture,
  createMissingAuthSessionResult,
  createNullableStringNull,
} from "~/src/integrations/better-auth/__test__/fixtures/auth.session.fixture"
import { ROLE_CODES } from "~/src/integrations/better-auth/auth.access"
import type { auth } from "~/src/integrations/better-auth/auth.server"
import * as authServer from "~/src/integrations/better-auth/auth.server"

import { settingsChangePasswordMutation } from "~/src/modules/account/use-cases/change-password"

const HEADERS = new Headers()
const USER_ID = "01900000-0000-7000-8000-000000000001"

type AuthApi = typeof auth.api

const getSessionMock = vi.hoisted(() => vi.fn<AuthApi["getSession"]>())
const changePasswordMock = vi.hoisted(() => vi.fn<AuthApi["changePassword"]>())

vi.mock(import("@tanstack/react-start/server-only"), () => ({}))

vi.mock(import("@tanstack/react-start/server"), (): Partial<typeof StartServerModule> => ({
  getRequest: vi.fn(() => new Request("http://127.0.0.1:3000/", { headers: HEADERS })),
}))

describe("change-password", () => {
  it("changes the signed-in admin password", async () => {
    expect.hasAssertions()
    getSessionMock.mockReset()
    changePasswordMock.mockReset()
    vi.spyOn(authServer.auth.api, "getSession").mockImplementation(getSessionMock)
    vi.spyOn(authServer.auth.api, "changePassword").mockImplementation(changePasswordMock)
    getSessionMock.mockResolvedValue(createAuthSessionFixture({ role: ROLE_CODES.ADMIN, userId: USER_ID }))
    const changeResult = {
      token: createNullableStringNull(),
      user: createAuthSessionFixture({ userId: USER_ID }).user,
    }
    changePasswordMock.mockResolvedValue(changeResult)

    await expect(
      executeMutation(settingsChangePasswordMutation, { currentPassword: "OldSecret1!", newPassword: "Secret1!" }),
    ).resolves.toMatchObject(changeResult)
  })

  it("returns a domain error when the caller is signed out", async () => {
    expect.hasAssertions()
    getSessionMock.mockReset()
    vi.spyOn(authServer.auth.api, "getSession").mockImplementation(getSessionMock)
    getSessionMock.mockResolvedValue(createMissingAuthSessionResult())

    await expect(
      executeMutation(settingsChangePasswordMutation, { currentPassword: "OldSecret1!", newPassword: "Secret1!" }),
    ).rejects.toThrow("UNAUTHORIZED")
  })
})
