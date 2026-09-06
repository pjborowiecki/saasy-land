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

import { enableTwoFactorMutation } from "~/src/modules/two-factor/use-cases/enable-two-factor"

const HEADERS = new Headers()
const USER_ID = "01900000-0000-7000-8000-000000000001"

type AuthApi = typeof auth.api

const enableTwoFactorMock = vi.hoisted(() => vi.fn<AuthApi["enableTwoFactor"]>())
const getSessionMock = vi.hoisted(() => vi.fn<AuthApi["getSession"]>())

vi.mock(import("@tanstack/react-start/server-only"), () => ({}))

vi.mock(import("@tanstack/react-start/server"), (): Partial<typeof StartServerModule> => ({
  getRequest: vi.fn(() => new Request("http://127.0.0.1:3000/", { headers: HEADERS })),
}))

describe("enable-two-factor", () => {
  it("calls auth.api.enableTwoFactor for admins", async () => {
    expect.hasAssertions()
    enableTwoFactorMock.mockReset()
    getSessionMock.mockReset()
    vi.spyOn(authServer.auth.api, "getSession").mockImplementation(getSessionMock)
    vi.spyOn(authServer.auth.api, "enableTwoFactor").mockImplementation(enableTwoFactorMock)
    getSessionMock.mockResolvedValue(createAuthSessionFixture({ role: ROLE_CODES.ADMIN, userId: USER_ID }))
    enableTwoFactorMock.mockResolvedValue({ backupCodes: ["code-1"], method: "totp", totpURI: "otpauth://totp" })

    await expect(executeMutation(enableTwoFactorMutation, { password: "Secret1!" })).resolves.toMatchObject({
      backupCodes: ["code-1"],
      totpURI: "otpauth://totp",
    })
    expect(enableTwoFactorMock).toHaveBeenCalledWith({ body: { password: "Secret1!" }, headers: HEADERS })
  })

  it("returns a domain error when the caller is signed out", async () => {
    expect.hasAssertions()
    getSessionMock.mockReset()
    vi.spyOn(authServer.auth.api, "getSession").mockImplementation(getSessionMock)
    getSessionMock.mockResolvedValue(createMissingAuthSessionResult())

    await expect(executeMutation(enableTwoFactorMutation, { password: "Secret1!" })).rejects.toThrow("UNAUTHORIZED")
  })
})
