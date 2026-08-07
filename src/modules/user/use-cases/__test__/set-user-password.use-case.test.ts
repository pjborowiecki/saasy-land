import type * as NextCacheModule from "next/cache"
import type * as NextHeadersModule from "next/headers"

import { setUserPassword } from "~/src/modules/user/use-cases/set-user-password.use-case"

import { createAuthSessionFixture } from "~/src/integrations/better-auth/__test__/fixtures/auth.session.fixture"
import { RoleCode } from "~/src/integrations/better-auth/auth.access"
import type { auth } from "~/src/integrations/better-auth/auth.server"
import * as authServer from "~/src/integrations/better-auth/auth.server"

const HEADERS = new Headers()
const TARGET_USER_ID = "01900000-0000-7000-8000-000000000002"
const ADMIN_USER_ID = "01900000-0000-7000-8000-000000000001"

type AuthApi = typeof auth.api

const getSessionMock = vi.hoisted(() => vi.fn<AuthApi["getSession"]>())
const setUserPasswordMock = vi.hoisted(() => vi.fn<AuthApi["setUserPassword"]>())

vi.mock(import("server-only"), () => ({}))

vi.mock(
  import("next/cache"),
  (): Partial<typeof NextCacheModule> => ({
    cacheLife: vi.fn<() => void>(),
    cacheTag: vi.fn<(tag: string) => void>(),
    revalidateTag: vi.fn<(tag: string, profile: string | { expire?: number }) => undefined>(),
    updateTag: vi.fn<(tag: string) => undefined>(),
  }),
)

vi.mock(
  import("next/headers"),
  (): Partial<typeof NextHeadersModule> => ({
    headers: vi.fn<() => Promise<Headers>>(() => Promise.resolve(HEADERS)),
  }),
)

describe("set-user-password", () => {
  it("sets a user password when the caller is an admin", async () => {
    expect.hasAssertions()
    getSessionMock.mockReset()
    setUserPasswordMock.mockReset()
    vi.spyOn(authServer.auth.api, "getSession").mockImplementation(getSessionMock)
    vi.spyOn(authServer.auth.api, "setUserPassword").mockImplementation(setUserPasswordMock)
    getSessionMock.mockResolvedValue(createAuthSessionFixture({ role: RoleCode.ADMIN, userId: ADMIN_USER_ID }))
    setUserPasswordMock.mockResolvedValue({ status: true })

    await expect(setUserPassword({ newPassword: "Secret1!", userId: TARGET_USER_ID })).resolves.toMatchObject({
      data: { status: true },
    })
  })
})
