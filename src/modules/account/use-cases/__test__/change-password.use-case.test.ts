import type * as NextHeadersModule from "next/headers"

import { settingsChangePassword } from "~/src/modules/account/use-cases/change-password.use-case"

import {
  createAuthSessionFixture,
  createMissingAuthSessionResult,
  createNullableStringNull,
} from "~/src/integrations/better-auth/__test__/fixtures/auth.session.fixture"
import { ROLE_CODES } from "~/src/integrations/better-auth/auth.access"
import type { auth } from "~/src/integrations/better-auth/auth.server"
import * as authServer from "~/src/integrations/better-auth/auth.server"

const HEADERS = new Headers()
const USER_ID = "01900000-0000-7000-8000-000000000001"

type AuthApi = typeof auth.api

const getSessionMock = vi.hoisted(() => vi.fn<AuthApi["getSession"]>())
const changePasswordMock = vi.hoisted(() => vi.fn<AuthApi["changePassword"]>())

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

describe("change-password", () => {
  it("changes the signed-in admin password", async () => {
    expect.hasAssertions()
    getSessionMock.mockReset()
    changePasswordMock.mockReset()
    vi.spyOn(authServer.auth.api, "getSession").mockImplementation(getSessionMock)
    vi.spyOn(authServer.auth.api, "changePassword").mockImplementation(changePasswordMock)
    getSessionMock.mockResolvedValue(createAuthSessionFixture({ role: ROLE_CODES.ADMIN, userId: USER_ID }))
    const changeResult = {
      token: createNullableStringNull(),
      user: createAuthSessionFixture({ userId: USER_ID }).user,
    }
    changePasswordMock.mockResolvedValue(changeResult)

    await expect(settingsChangePassword({ currentPassword: "OldSecret1!", newPassword: "Secret1!" })).resolves.toMatchObject({
      data: changeResult,
    })
  })

  it("returns a domain error when the caller is signed out", async () => {
    expect.hasAssertions()
    getSessionMock.mockReset()
    vi.spyOn(authServer.auth.api, "getSession").mockImplementation(getSessionMock)
    getSessionMock.mockResolvedValue(createMissingAuthSessionResult())

    await expect(settingsChangePassword({ currentPassword: "OldSecret1!", newPassword: "Secret1!" })).resolves.toMatchObject({
      serverError: { code: "UNAUTHORIZED" },
    })
  })
})
