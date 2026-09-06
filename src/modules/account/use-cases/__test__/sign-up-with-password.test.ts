import type * as StartServerModule from "@tanstack/react-start/server"
import { getRequest } from "@tanstack/react-start/server"
import { describe, expect, it, vi } from "vite-plus/test"

import { executeMutation } from "~/src/platform/testing/lib/query"

import type { auth } from "~/src/integrations/better-auth/auth.server"
import * as authServer from "~/src/integrations/better-auth/auth.server"

import { signUpWithPasswordMutation } from "~/src/modules/account/use-cases/sign-up-with-password"

const HEADERS = new Headers()
const SINGLE_CALL = 1

type AuthApi = typeof auth.api

const signUpEmailMock = vi.hoisted(() => vi.fn<AuthApi["signUpEmail"]>())

vi.mock(import("@tanstack/react-start/server-only"), () => ({}))

vi.mock(import("@tanstack/react-start/server"), (): Partial<typeof StartServerModule> => ({
  getRequest: vi.fn(() => new Request("http://127.0.0.1:3000/", { headers: HEADERS })),
}))

describe("signUpWithPassword use case", () => {
  it("calls auth.api.signUpEmail with the valid input", async () => {
    expect.hasAssertions()
    signUpEmailMock.mockReset()
    // @ts-expect-error Mocking Better Auth API signUpEmail function
    signUpEmailMock.mockResolvedValue({ token: "test-token", user: { email: "newuser@example.com", id: "u-1" } })
    vi.spyOn(authServer.auth.api, "signUpEmail").mockImplementation(signUpEmailMock)

    const payload = {
      confirmPassword: "Password123!",
      email: "newuser@example.com",
      name: "New User",
      password: "Password123!",
    }

    await expect(executeMutation(signUpWithPasswordMutation, payload)).resolves.toMatchObject({ token: "test-token" })

    expect(signUpEmailMock).toHaveBeenCalledTimes(SINGLE_CALL)
    const call = signUpEmailMock.mock.calls[0]?.[0]
    expect(call).toMatchObject({
      asResponse: false,
      body: payload,
      headers: HEADERS,
    })
    expect(call?.request?.url).toBe(getRequest().url)
    expect(call?.request?.method).toBe("POST")
    await expect(call?.request?.json()).resolves.toEqual(payload)
  })
})
