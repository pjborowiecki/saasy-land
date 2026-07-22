import type * as NextHeadersModule from "next/headers"

import { settingsSignOutUser } from "~/src/modules/account/use-cases/sign-out-user.use-case"

import { createAuthSessionFixture } from "~/src/integrations/better-auth/__test__/fixtures/auth.session.fixture"
import { RoleCode } from "~/src/integrations/better-auth/auth.access"
import type { auth } from "~/src/integrations/better-auth/auth.server"
import * as authServer from "~/src/integrations/better-auth/auth.server"

const HEADERS = new Headers()
const USER_ID = "01900000-0000-7000-8000-000000000001"

type AuthApi = typeof auth.api

const getSessionMock = vi.hoisted(() => vi.fn<AuthApi["getSession"]>())
const signOutMock = vi.hoisted(() => vi.fn<AuthApi["signOut"]>())

vi.mock(import("server-only"), () => ({}))

vi.mock(
  import("next/headers"),
  (): Partial<typeof NextHeadersModule> => ({
    headers: vi.fn<() => Promise<Headers>>(() => Promise.resolve(HEADERS)),
  }),
)

describe("sign-out-user", () => {
  it("signs out the current user", async () => {
    expect.hasAssertions()
    getSessionMock.mockReset()
    signOutMock.mockReset()
    vi.spyOn(authServer.auth.api, "getSession").mockImplementation(getSessionMock)
    vi.spyOn(authServer.auth.api, "signOut").mockImplementation(signOutMock)
    getSessionMock.mockResolvedValue(createAuthSessionFixture({ role: RoleCode.CUSTOMER, userId: USER_ID }))
    signOutMock.mockResolvedValue({ success: true })

    await expect(settingsSignOutUser()).resolves.toMatchObject({ data: { success: true } })
  })
})
