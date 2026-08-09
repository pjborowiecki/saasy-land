import type * as NextHeadersModule from "next/headers"

import { requestPasswordReset } from "~/src/modules/verification/use-cases/request-password-reset.use-case"

import type { auth } from "~/src/integrations/better-auth/auth.server"
import * as authServer from "~/src/integrations/better-auth/auth.server"

const HEADERS = new Headers()

type AuthApi = typeof auth.api

const requestPasswordResetMock = vi.hoisted(() => vi.fn<AuthApi["requestPasswordReset"]>())

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

describe("request-password-reset", () => {
  it("calls auth.api.requestPasswordReset", async () => {
    expect.hasAssertions()
    requestPasswordResetMock.mockReset()
    vi.spyOn(authServer.auth.api, "requestPasswordReset").mockImplementation(requestPasswordResetMock)
    const resetRequestResult = { message: "ok", status: true }
    requestPasswordResetMock.mockResolvedValue(resetRequestResult)

    await expect(
      requestPasswordReset({
        email: "user@example.com",
        redirectTo: "https://example.com/reset-password",
      }),
    ).resolves.toMatchObject({ data: resetRequestResult })

    expect(requestPasswordResetMock).toHaveBeenCalledWith({
      body: {
        email: "user@example.com",
        redirectTo: "https://example.com/reset-password",
      },
      headers: HEADERS,
    })
  })
})
