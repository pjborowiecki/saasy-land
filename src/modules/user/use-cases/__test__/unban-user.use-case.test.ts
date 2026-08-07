import type * as NextCacheModule from "next/cache"
import type * as NextHeadersModule from "next/headers"

import { unbanUser } from "~/src/modules/user/use-cases/unban-user.use-case"

import {
  createAuthSessionFixture,
  createAuthUserMutationResult,
} from "~/src/integrations/better-auth/__test__/fixtures/auth.session.fixture"
import { RoleCode } from "~/src/integrations/better-auth/auth.access"
import type { auth } from "~/src/integrations/better-auth/auth.server"
import * as authServer from "~/src/integrations/better-auth/auth.server"

const HEADERS = new Headers()
const TARGET_USER_ID = "01900000-0000-7000-8000-000000000002"
const ADMIN_USER_ID = "01900000-0000-7000-8000-000000000001"

type AuthApi = typeof auth.api

const getSessionMock = vi.hoisted(() => vi.fn<AuthApi["getSession"]>())
const unbanUserMock = vi.hoisted(() => vi.fn<AuthApi["unbanUser"]>())

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

describe("unban-user", () => {
  it("unbans a user when the caller is an admin", async () => {
    expect.hasAssertions()
    getSessionMock.mockReset()
    unbanUserMock.mockReset()
    vi.spyOn(authServer.auth.api, "getSession").mockImplementation(getSessionMock)
    vi.spyOn(authServer.auth.api, "unbanUser").mockImplementation(unbanUserMock)
    getSessionMock.mockResolvedValue(createAuthSessionFixture({ role: RoleCode.ADMIN, userId: ADMIN_USER_ID }))
    const mutationResult = createAuthUserMutationResult({ userId: TARGET_USER_ID })
    unbanUserMock.mockResolvedValue(mutationResult)

    await expect(unbanUser({ userId: TARGET_USER_ID })).resolves.toMatchObject({ data: mutationResult })
  })
})
