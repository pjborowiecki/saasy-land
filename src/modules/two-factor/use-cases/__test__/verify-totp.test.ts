import type * as StartServerModule from "@tanstack/react-start/server"
import { describe, expect, it, vi } from "vite-plus/test"

import { executeMutation } from "~/src/platform/testing/lib/query"

import { createAuthSessionFixture } from "~/src/integrations/better-auth/__test__/fixtures/auth.session.fixture"
import type { auth } from "~/src/integrations/better-auth/auth.server"
import * as authServer from "~/src/integrations/better-auth/auth.server"

import { verifyTotpMutation } from "~/src/modules/two-factor/use-cases/verify-totp"

const HEADERS = new Headers()
const USER_ID = "01900000-0000-7000-8000-000000000001"

type AuthApi = typeof auth.api

const verifyTotpMock = vi.hoisted(() => vi.fn<AuthApi["verifyTOTP"]>())

vi.mock(import("@tanstack/react-start/server-only"), () => ({}))

vi.mock(import("@tanstack/react-start/server"), (): Partial<typeof StartServerModule> => ({
  getRequest: vi.fn(() => new Request("http://127.0.0.1:3000/", { headers: HEADERS })),
}))

describe("verify-totp", () => {
  it("calls auth.api.verifyTOTP with the submitted code", async () => {
    expect.hasAssertions()
    verifyTotpMock.mockReset()
    vi.spyOn(authServer.auth.api, "verifyTOTP").mockImplementation(verifyTotpMock)
    const verifyResult = { token: "session-token", user: createAuthSessionFixture({ userId: USER_ID }).user }
    verifyTotpMock.mockResolvedValue(verifyResult)

    await expect(executeMutation(verifyTotpMutation, { code: "123456", trustDevice: true })).resolves.toMatchObject(verifyResult)
    expect(verifyTotpMock).toHaveBeenCalledWith({
      body: { code: "123456", trustDevice: true },
      headers: HEADERS,
    })
  })

  it("omits trustDevice from the auth body when it is not provided", async () => {
    expect.hasAssertions()
    verifyTotpMock.mockReset()
    vi.spyOn(authServer.auth.api, "verifyTOTP").mockImplementation(verifyTotpMock)
    const verifyResult = { token: "session-token", user: createAuthSessionFixture({ userId: USER_ID }).user }
    verifyTotpMock.mockResolvedValue(verifyResult)

    await expect(executeMutation(verifyTotpMutation, { code: "123456" })).resolves.toMatchObject(verifyResult)
    expect(verifyTotpMock).toHaveBeenCalledWith({
      body: { code: "123456" },
      headers: HEADERS,
    })
  })
})
