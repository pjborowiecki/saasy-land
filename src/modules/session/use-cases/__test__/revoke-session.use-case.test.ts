import type * as NextHeadersModule from "next/headers"

import { settingsRevokeSession } from "~/src/modules/session/use-cases/revoke-session.use-case"

import { createAuthSessionFixture } from "~/src/integrations/better-auth/__test__/fixtures/auth.session.fixture"
import { RoleCode } from "~/src/integrations/better-auth/auth.access"
import type { auth } from "~/src/integrations/better-auth/auth.server"
import * as authServer from "~/src/integrations/better-auth/auth.server"

const HEADERS = new Headers()
const USER_ID = "01900000-0000-7000-8000-000000000001"

type AuthApi = typeof auth.api

const getSessionMock = vi.hoisted(() => vi.fn<AuthApi["getSession"]>())
const revokeSessionMock = vi.hoisted(() => vi.fn<AuthApi["revokeSession"]>())

vi.mock(import("server-only"), () => ({}))

vi.mock(
  import("next/headers"),
  (): Partial<typeof NextHeadersModule> => ({
    headers: vi.fn<() => Promise<Headers>>(() => Promise.resolve(HEADERS)),
  }),
)

describe("revoke-session", () => {
  it("revokes one session for admins", async () => {
    expect.hasAssertions()
    getSessionMock.mockReset()
    revokeSessionMock.mockReset()
    vi.spyOn(authServer.auth.api, "getSession").mockImplementation(getSessionMock)
    vi.spyOn(authServer.auth.api, "revokeSession").mockImplementation(revokeSessionMock)
    getSessionMock.mockResolvedValue(createAuthSessionFixture({ role: RoleCode.ADMIN, userId: USER_ID }))
    revokeSessionMock.mockResolvedValue({ status: true })

    await expect(settingsRevokeSession({ token: "token-1" })).resolves.toMatchObject({ data: { status: true } })
  })

  it("returns a domain error when the caller lacks settings access", async () => {
    expect.hasAssertions()
    getSessionMock.mockReset()
    vi.spyOn(authServer.auth.api, "getSession").mockImplementation(getSessionMock)
    getSessionMock.mockResolvedValue(createAuthSessionFixture({ role: RoleCode.CUSTOMER, userId: USER_ID }))

    await expect(settingsRevokeSession({ token: "token-1" })).resolves.toMatchObject({
      serverError: { code: "FORBIDDEN" },
    })
  })
})
