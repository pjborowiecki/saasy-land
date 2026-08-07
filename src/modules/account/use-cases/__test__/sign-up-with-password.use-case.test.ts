import type * as NextHeadersModule from "next/headers"

import { signUpWithPassword } from "~/src/modules/account/use-cases/sign-up-with-password.use-case"

import type { auth } from "~/src/integrations/better-auth/auth.server"
import * as authServer from "~/src/integrations/better-auth/auth.server"

const HEADERS = new Headers()
const SINGLE_CALL = 1

type AuthApi = typeof auth.api

const signUpEmailMock = vi.hoisted(() => vi.fn<AuthApi["signUpEmail"]>())

vi.mock(import("server-only"), () => ({}))

vi.mock(
  import("next/headers"),
  (): Partial<typeof NextHeadersModule> => ({
    headers: vi.fn<() => Promise<Headers>>(() => Promise.resolve(HEADERS)),
  }),
)

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

    await expect(signUpWithPassword(payload)).resolves.toMatchObject({
      data: { token: "test-token" },
    })

    expect(signUpEmailMock).toHaveBeenCalledTimes(SINGLE_CALL)
    expect(signUpEmailMock).toHaveBeenCalledWith({
      body: payload,
      headers: HEADERS,
    })
  })
})
