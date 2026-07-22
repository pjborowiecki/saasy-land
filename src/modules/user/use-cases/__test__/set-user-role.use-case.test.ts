import type * as NextHeadersModule from "next/headers"

import { setUserRole } from "~/src/modules/user/use-cases/set-user-role.use-case"

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
const setRoleMock = vi.hoisted(() => vi.fn<AuthApi["setRole"]>())

vi.mock(import("server-only"), () => ({}))

vi.mock(
  import("next/headers"),
  (): Partial<typeof NextHeadersModule> => ({
    headers: vi.fn<() => Promise<Headers>>(() => Promise.resolve(HEADERS)),
  }),
)

describe("set-user-role", () => {
  it("sets a user role when the caller is an admin", async () => {
    expect.hasAssertions()
    getSessionMock.mockReset()
    setRoleMock.mockReset()
    vi.spyOn(authServer.auth.api, "getSession").mockImplementation(getSessionMock)
    vi.spyOn(authServer.auth.api, "setRole").mockImplementation(setRoleMock)
    getSessionMock.mockResolvedValue(createAuthSessionFixture({ role: RoleCode.ADMIN, userId: ADMIN_USER_ID }))
    const mutationResult = createAuthUserMutationResult({ role: RoleCode.CUSTOMER, userId: TARGET_USER_ID })
    setRoleMock.mockResolvedValue(mutationResult)

    await expect(setUserRole({ role: RoleCode.CUSTOMER, userId: TARGET_USER_ID })).resolves.toMatchObject({
      data: mutationResult,
    })
  })
})
