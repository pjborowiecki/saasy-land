import type * as NextHeadersModule from "next/headers"

import { resetPassword } from "~/src/modules/verification/use-cases/reset-password.use-case"

import type { auth } from "~/src/integrations/better-auth/auth.server"
import * as authServer from "~/src/integrations/better-auth/auth.server"

const HEADERS = new Headers()
const RESET_TOKEN = "reset-token"

type AuthApi = typeof auth.api

const resetPasswordMock = vi.hoisted(() => vi.fn<AuthApi["resetPassword"]>())

vi.mock(import("server-only"), () => ({}))

const redisMocks = vi.hoisted(() => {
  const FIRST_COUNT = 1
  return {
    expire: vi.fn<() => Promise<number>>(() => Promise.resolve(FIRST_COUNT)),
    incr: vi.fn<() => Promise<number>>(() => Promise.resolve(FIRST_COUNT)),
  }
})

// @ts-expect-error Vitest module mock factory is not inferred for the redis client export.
vi.mock(import("~/src/integrations/redis/redis.config"), () => ({ redis: redisMocks }))

vi.mock(
  import("next/headers"),
  (): Partial<typeof NextHeadersModule> => ({
    headers: vi.fn<() => Promise<Headers>>(() => Promise.resolve(HEADERS)),
  }),
)

describe("reset-password", () => {
  it("calls auth.api.resetPassword with the token and new password", async () => {
    expect.hasAssertions()
    resetPasswordMock.mockReset()
    vi.spyOn(authServer.auth.api, "resetPassword").mockImplementation(resetPasswordMock)
    const resetResult = { status: true }
    resetPasswordMock.mockResolvedValue(resetResult)

    await expect(
      resetPassword({
        confirmPassword: "Password1!",
        password: "Password1!",
        token: RESET_TOKEN,
      }),
    ).resolves.toMatchObject({ data: resetResult })

    expect(resetPasswordMock).toHaveBeenCalledWith({
      body: { newPassword: "Password1!", token: RESET_TOKEN },
      headers: HEADERS,
    })
  })
})
