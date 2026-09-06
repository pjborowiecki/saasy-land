import type * as StartServerModule from "@tanstack/react-start/server"
import { describe, expect, it, vi } from "vite-plus/test"

import { executeMutation } from "~/src/platform/testing/lib/query"

import { createAuthSessionFixture } from "~/src/integrations/better-auth/__test__/fixtures/auth.session.fixture"
import type { auth } from "~/src/integrations/better-auth/auth.server"
import * as authServer from "~/src/integrations/better-auth/auth.server"

import { verifyBackupCodeMutation } from "~/src/modules/two-factor/use-cases/verify-backup-code"

const HEADERS = new Headers()
const USER_ID = "01900000-0000-7000-8000-000000000001"

type AuthApi = typeof auth.api

const verifyBackupCodeMock = vi.hoisted(() => vi.fn<AuthApi["verifyBackupCode"]>())

vi.mock(import("@tanstack/react-start/server-only"), () => ({}))

vi.mock(import("@tanstack/react-start/server"), (): Partial<typeof StartServerModule> => ({
  getRequest: vi.fn(() => new Request("http://127.0.0.1:3000/", { headers: HEADERS })),
}))

describe("verify-backup-code", () => {
  it("calls auth.api.verifyBackupCode with the submitted code", async () => {
    expect.hasAssertions()
    verifyBackupCodeMock.mockReset()
    vi.spyOn(authServer.auth.api, "verifyBackupCode").mockImplementation(verifyBackupCodeMock)
    const verifyResult = { token: "session-token", user: createAuthSessionFixture({ userId: USER_ID }).user }
    verifyBackupCodeMock.mockResolvedValue(verifyResult)

    await expect(executeMutation(verifyBackupCodeMutation, { code: "backup-code", trustDevice: true })).resolves.toMatchObject(verifyResult)
    expect(verifyBackupCodeMock).toHaveBeenCalledWith({
      body: { code: "backup-code", trustDevice: true },
      headers: HEADERS,
    })
  })

  it("omits trustDevice from the auth body when it is not provided", async () => {
    expect.hasAssertions()
    verifyBackupCodeMock.mockReset()
    vi.spyOn(authServer.auth.api, "verifyBackupCode").mockImplementation(verifyBackupCodeMock)
    const verifyResult = { token: "session-token", user: createAuthSessionFixture({ userId: USER_ID }).user }
    verifyBackupCodeMock.mockResolvedValue(verifyResult)

    await expect(executeMutation(verifyBackupCodeMutation, { code: "backup-code" })).resolves.toMatchObject(verifyResult)
    expect(verifyBackupCodeMock).toHaveBeenCalledWith({
      body: { code: "backup-code" },
      headers: HEADERS,
    })
  })
})
