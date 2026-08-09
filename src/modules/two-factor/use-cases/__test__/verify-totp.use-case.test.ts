import type * as NextHeadersModule from "next/headers"

import { verifyTotp } from "~/src/modules/two-factor/use-cases/verify-totp.use-case"

import { createAuthSessionFixture } from "~/src/integrations/better-auth/__test__/fixtures/auth.session.fixture"
import type { auth } from "~/src/integrations/better-auth/auth.server"
import * as authServer from "~/src/integrations/better-auth/auth.server"

const HEADERS = new Headers()
const USER_ID = "01900000-0000-7000-8000-000000000001"

type AuthApi = typeof auth.api

const verifyTotpMock = vi.hoisted(() => vi.fn<AuthApi["verifyTOTP"]>())

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

describe("verify-totp", () => {
  it("calls auth.api.verifyTOTP with the submitted code", async () => {
    expect.hasAssertions()
    verifyTotpMock.mockReset()
    vi.spyOn(authServer.auth.api, "verifyTOTP").mockImplementation(verifyTotpMock)
    const verifyResult = { token: "session-token", user: createAuthSessionFixture({ userId: USER_ID }).user }
    verifyTotpMock.mockResolvedValue(verifyResult)

    await expect(verifyTotp({ code: "123456", trustDevice: true })).resolves.toMatchObject({ data: verifyResult })
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

    await expect(verifyTotp({ code: "123456" })).resolves.toMatchObject({ data: verifyResult })
    expect(verifyTotpMock).toHaveBeenCalledWith({
      body: { code: "123456" },
      headers: HEADERS,
    })
  })
})
