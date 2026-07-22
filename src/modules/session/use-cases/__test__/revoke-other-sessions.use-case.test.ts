import type * as NextHeadersModule from "next/headers"

import { settingsRevokeOtherSessions } from "~/src/modules/session/use-cases/revoke-other-sessions.use-case"

import { createAuthSessionFixture } from "~/src/integrations/better-auth/__test__/fixtures/auth.session.fixture"
import { RoleCode } from "~/src/integrations/better-auth/auth.access"
import type { auth } from "~/src/integrations/better-auth/auth.server"
import * as authServer from "~/src/integrations/better-auth/auth.server"

const HEADERS = new Headers()
const USER_ID = "01900000-0000-7000-8000-000000000001"

type AuthApi = typeof auth.api

const getSessionMock = vi.hoisted(() => vi.fn<AuthApi["getSession"]>())
const revokeOtherSessionsMock = vi.hoisted(() => vi.fn<AuthApi["revokeOtherSessions"]>())

vi.mock(import("server-only"), () => ({}))

vi.mock(
  import("next/headers"),
  (): Partial<typeof NextHeadersModule> => ({
    headers: vi.fn<() => Promise<Headers>>(() => Promise.resolve(HEADERS)),
  }),
)

describe("revoke-other-sessions", () => {
  it("revokes other sessions for admins", async () => {
    expect.hasAssertions()
    getSessionMock.mockReset()
    revokeOtherSessionsMock.mockReset()
    vi.spyOn(authServer.auth.api, "getSession").mockImplementation(getSessionMock)
    vi.spyOn(authServer.auth.api, "revokeOtherSessions").mockImplementation(revokeOtherSessionsMock)
    getSessionMock.mockResolvedValue(createAuthSessionFixture({ role: RoleCode.ADMIN, userId: USER_ID }))
    revokeOtherSessionsMock.mockResolvedValue({ status: true })

    await expect(settingsRevokeOtherSessions()).resolves.toMatchObject({ data: { status: true } })
  })

  it("returns a domain error when the caller lacks settings access", async () => {
    expect.hasAssertions()
    getSessionMock.mockReset()
    vi.spyOn(authServer.auth.api, "getSession").mockImplementation(getSessionMock)
    getSessionMock.mockResolvedValue(createAuthSessionFixture({ role: RoleCode.CUSTOMER, userId: USER_ID }))

    await expect(settingsRevokeOtherSessions()).resolves.toMatchObject({
      serverError: { code: "FORBIDDEN" },
    })
  })
})
