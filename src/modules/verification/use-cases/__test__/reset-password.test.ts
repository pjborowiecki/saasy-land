import type * as StartServerModule from "@tanstack/react-start/server"
import { describe, expect, it, vi } from "vite-plus/test"

import { executeMutation } from "~/src/platform/testing/lib/query"

import type { auth } from "~/src/integrations/better-auth/auth.server"
import * as authServer from "~/src/integrations/better-auth/auth.server"

import { resetPasswordMutation } from "~/src/modules/verification/use-cases/reset-password"

const HEADERS = new Headers()
const RESET_TOKEN = "reset-token"

type AuthApi = typeof auth.api

const resetPasswordMock = vi.hoisted(() => vi.fn<AuthApi["resetPassword"]>())

vi.mock(import("@tanstack/react-start/server-only"), () => ({}))

vi.mock(import("@tanstack/react-start/server"), (): Partial<typeof StartServerModule> => ({
  getRequest: vi.fn(() => new Request("http://127.0.0.1:3000/", { headers: HEADERS })),
}))

describe("reset-password", () => {
  it("calls auth.api.resetPassword with the token and new password", async () => {
    expect.hasAssertions()
    resetPasswordMock.mockReset()
    vi.spyOn(authServer.auth.api, "resetPassword").mockImplementation(resetPasswordMock)
    const resetResult = { status: true }
    resetPasswordMock.mockResolvedValue(resetResult)

    await expect(
      executeMutation(resetPasswordMutation, {
        confirmPassword: "Password1!",
        password: "Password1!",
        token: RESET_TOKEN,
      }),
    ).resolves.toMatchObject(resetResult)

    expect(resetPasswordMock).toHaveBeenCalledWith({
      body: { newPassword: "Password1!", token: RESET_TOKEN },
      headers: HEADERS,
    })
  })
})
