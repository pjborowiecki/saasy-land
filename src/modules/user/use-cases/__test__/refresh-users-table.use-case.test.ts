import type * as NextCacheModule from "next/cache"
import type * as NextHeadersModule from "next/headers"

import { refreshUsersTable } from "~/src/modules/user/use-cases/refresh-users-table.use-case"

import { createAuthSessionFixture } from "~/src/integrations/better-auth/__test__/fixtures/auth.session.fixture"
import { RoleCode } from "~/src/integrations/better-auth/auth.access"
import type { auth } from "~/src/integrations/better-auth/auth.server"
import * as authServer from "~/src/integrations/better-auth/auth.server"

const HEADERS = new Headers()
const ADMIN_USER_ID = "01900000-0000-7000-8000-000000000001"
const SINGLE_CALL = 1

type AuthApi = typeof auth.api

const getSessionMock = vi.hoisted(() => vi.fn<AuthApi["getSession"]>())
const revalidatePathMock = vi.hoisted(() => vi.fn<typeof NextCacheModule.revalidatePath>())

vi.mock(import("server-only"), () => ({}))

vi.mock(
  import("next/headers"),
  (): Partial<typeof NextHeadersModule> => ({
    headers: vi.fn<() => Promise<Headers>>(() => Promise.resolve(HEADERS)),
  }),
)

vi.mock(
  import("next/cache"),
  (): Partial<typeof NextCacheModule> => ({
    revalidatePath: revalidatePathMock,
  }),
)

describe("refresh-users-table", () => {
  it("revalidates the admin users page for admins", async () => {
    expect.hasAssertions()
    getSessionMock.mockReset()
    revalidatePathMock.mockReset()
    vi.spyOn(authServer.auth.api, "getSession").mockImplementation(getSessionMock)
    getSessionMock.mockResolvedValue(createAuthSessionFixture({ role: RoleCode.ADMIN, userId: ADMIN_USER_ID }))

    await expect(refreshUsersTable()).resolves.toStrictEqual({})

    expect(revalidatePathMock).toHaveBeenCalledTimes(SINGLE_CALL)
    expect(revalidatePathMock).toHaveBeenCalledWith("/[locale]/admin/users", "page")
  })

  it("returns a domain error when the caller is not an admin", async () => {
    expect.hasAssertions()
    getSessionMock.mockReset()
    revalidatePathMock.mockReset()
    vi.spyOn(authServer.auth.api, "getSession").mockImplementation(getSessionMock)
    getSessionMock.mockResolvedValue(createAuthSessionFixture({ role: RoleCode.CUSTOMER, userId: ADMIN_USER_ID }))

    await expect(refreshUsersTable()).resolves.toMatchObject({
      serverError: { code: "FORBIDDEN" },
    })
    expect(revalidatePathMock).not.toHaveBeenCalled()
  })
})
