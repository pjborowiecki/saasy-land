import type * as NextHeadersModule from "next/headers"

import { revokeUserSessions } from "~/src/modules/session/use-cases/revoke-user-sessions.use-case"

import { createAuthSessionFixture } from "~/src/integrations/better-auth/__test__/fixtures/auth.session.fixture"
import { RoleCode } from "~/src/integrations/better-auth/auth.access"
import type { auth } from "~/src/integrations/better-auth/auth.server"
import * as authServer from "~/src/integrations/better-auth/auth.server"

const HEADERS = new Headers()
const TARGET_USER_ID = "01900000-0000-7000-8000-000000000002"
const ADMIN_USER_ID = "01900000-0000-7000-8000-000000000001"

type AuthApi = typeof auth.api

const getSessionMock = vi.hoisted(() => vi.fn<AuthApi["getSession"]>())
const revokeUserSessionsMock = vi.hoisted(() => vi.fn<AuthApi["revokeUserSessions"]>())

vi.mock(import("server-only"), () => ({}))

vi.mock(
  import("next/headers"),
  (): Partial<typeof NextHeadersModule> => ({
    headers: vi.fn<() => Promise<Headers>>(() => Promise.resolve(HEADERS)),
  }),
)

describe("revoke-user-sessions", () => {
  it("revokes all sessions when the caller is an admin", async () => {
    expect.hasAssertions()
    getSessionMock.mockReset()
    revokeUserSessionsMock.mockReset()
    vi.spyOn(authServer.auth.api, "getSession").mockImplementation(getSessionMock)
    vi.spyOn(authServer.auth.api, "revokeUserSessions").mockImplementation(revokeUserSessionsMock)
    getSessionMock.mockResolvedValue(createAuthSessionFixture({ role: RoleCode.ADMIN, userId: ADMIN_USER_ID }))
    const revokeResult = { success: true }
    revokeUserSessionsMock.mockResolvedValue(revokeResult)

    await expect(revokeUserSessions({ userId: TARGET_USER_ID })).resolves.toMatchObject({ data: revokeResult })
    expect(revokeUserSessionsMock).toHaveBeenCalledWith({
      body: { userId: TARGET_USER_ID },
      headers: HEADERS,
    })
  })

  it("returns a domain error when the caller is not an admin", async () => {
    expect.hasAssertions()
    getSessionMock.mockReset()
    vi.spyOn(authServer.auth.api, "getSession").mockImplementation(getSessionMock)
    getSessionMock.mockResolvedValue(createAuthSessionFixture({ role: RoleCode.CUSTOMER, userId: ADMIN_USER_ID }))

    await expect(revokeUserSessions({ userId: TARGET_USER_ID })).resolves.toMatchObject({
      serverError: { code: "FORBIDDEN" },
    })
  })
})
