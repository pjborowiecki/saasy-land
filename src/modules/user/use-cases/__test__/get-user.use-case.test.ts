import type * as NextHeadersModule from "next/headers"

import { getUser } from "~/src/modules/user/use-cases/get-user.use-case"

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
const getUserMock = vi.hoisted(() => vi.fn<AuthApi["getUser"]>())

vi.mock(import("server-only"), () => ({}))

vi.mock(
  import("next/headers"),
  (): Partial<typeof NextHeadersModule> => ({
    headers: vi.fn<() => Promise<Headers>>(() => Promise.resolve(HEADERS)),
  }),
)

describe("get-user", () => {
  it("fetches a user when the caller is an admin", async () => {
    expect.hasAssertions()
    getSessionMock.mockReset()
    getUserMock.mockReset()
    vi.spyOn(authServer.auth.api, "getSession").mockImplementation(getSessionMock)
    vi.spyOn(authServer.auth.api, "getUser").mockImplementation(getUserMock)
    getSessionMock.mockResolvedValue(createAuthSessionFixture({ role: RoleCode.ADMIN, userId: ADMIN_USER_ID }))
    const userResult = createAuthUserMutationResult({ userId: TARGET_USER_ID }).user
    getUserMock.mockResolvedValue(userResult)

    await expect(getUser({ userId: TARGET_USER_ID })).resolves.toMatchObject({ data: userResult })
    expect(getUserMock).toHaveBeenCalledWith({
      headers: HEADERS,
      query: { id: TARGET_USER_ID },
    })
  })

  it("returns a domain error when the caller is not an admin", async () => {
    expect.hasAssertions()
    getSessionMock.mockReset()
    vi.spyOn(authServer.auth.api, "getSession").mockImplementation(getSessionMock)
    getSessionMock.mockResolvedValue(createAuthSessionFixture({ role: RoleCode.CUSTOMER, userId: ADMIN_USER_ID }))

    await expect(getUser({ userId: TARGET_USER_ID })).resolves.toMatchObject({
      serverError: { code: "FORBIDDEN" },
    })
  })
})
