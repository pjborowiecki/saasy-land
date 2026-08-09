import type * as NextHeadersModule from "next/headers"

import { verifyEmail } from "~/src/modules/verification/use-cases/verify-email.use-case"

import type { auth } from "~/src/integrations/better-auth/auth.server"
import * as authServer from "~/src/integrations/better-auth/auth.server"

const HEADERS = new Headers()
const TOKEN = "verification-token"

type AuthApi = typeof auth.api

const verifyEmailMock = vi.hoisted(() => vi.fn<AuthApi["verifyEmail"]>())

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

describe("verify-email", () => {
  it("calls auth.api.verifyEmail with the token", async () => {
    expect.hasAssertions()
    verifyEmailMock.mockReset()
    verifyEmailMock.mockResolvedValue({ status: true })
    vi.spyOn(authServer.auth.api, "verifyEmail").mockImplementation(verifyEmailMock)

    await expect(verifyEmail({ token: TOKEN })).resolves.toMatchObject({ data: { status: true } })
    expect(verifyEmailMock).toHaveBeenCalledWith({ headers: HEADERS, query: { token: TOKEN } })
  })
})
