import type * as NextHeadersModule from "next/headers"

import { verifyBackupCode } from "~/src/modules/two-factor/use-cases/verify-backup-code.use-case"

import { createAuthSessionFixture } from "~/src/integrations/better-auth/__test__/fixtures/auth.session.fixture"
import type { auth } from "~/src/integrations/better-auth/auth.server"
import * as authServer from "~/src/integrations/better-auth/auth.server"

const HEADERS = new Headers()
const USER_ID = "01900000-0000-7000-8000-000000000001"

type AuthApi = typeof auth.api

const verifyBackupCodeMock = vi.hoisted(() => vi.fn<AuthApi["verifyBackupCode"]>())

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

describe("verify-backup-code", () => {
  it("calls auth.api.verifyBackupCode with the submitted code", async () => {
    expect.hasAssertions()
    verifyBackupCodeMock.mockReset()
    vi.spyOn(authServer.auth.api, "verifyBackupCode").mockImplementation(verifyBackupCodeMock)
    const verifyResult = { token: "session-token", user: createAuthSessionFixture({ userId: USER_ID }).user }
    verifyBackupCodeMock.mockResolvedValue(verifyResult)

    await expect(verifyBackupCode({ code: "backup-code", trustDevice: true })).resolves.toMatchObject({ data: verifyResult })
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

    await expect(verifyBackupCode({ code: "backup-code" })).resolves.toMatchObject({ data: verifyResult })
    expect(verifyBackupCodeMock).toHaveBeenCalledWith({
      body: { code: "backup-code" },
      headers: HEADERS,
    })
  })
})
