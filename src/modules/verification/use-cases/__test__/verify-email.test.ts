import type * as StartServerModule from "@tanstack/react-start/server"
import { describe, expect, it, vi } from "vite-plus/test"

import { executeMutation } from "~/src/platform/testing/lib/query"

import type { auth } from "~/src/integrations/better-auth/auth.server"
import * as authServer from "~/src/integrations/better-auth/auth.server"

import { verifyEmailMutation } from "~/src/modules/verification/use-cases/verify-email"

const HEADERS = new Headers()
const TOKEN = "verification-token"

type AuthApi = typeof auth.api

const verifyEmailMock = vi.hoisted(() => vi.fn<AuthApi["verifyEmail"]>())

vi.mock(import("@tanstack/react-start/server-only"), () => ({}))

vi.mock(import("@tanstack/react-start/server"), (): Partial<typeof StartServerModule> => ({
  getRequest: vi.fn(() => new Request("http://127.0.0.1:3000/", { headers: HEADERS })),
}))

describe("verify-email", () => {
  it("calls auth.api.verifyEmail with the token", async () => {
    expect.hasAssertions()
    verifyEmailMock.mockReset()
    verifyEmailMock.mockResolvedValue({ status: true })
    vi.spyOn(authServer.auth.api, "verifyEmail").mockImplementation(verifyEmailMock)

    await expect(executeMutation(verifyEmailMutation, { token: TOKEN })).resolves.toMatchObject({ status: true })
    expect(verifyEmailMock).toHaveBeenCalledWith({ headers: HEADERS, query: { token: TOKEN } })
  })
})
