import type * as NextHeadersModule from "next/headers"

import { disableTwoFactor } from "~/src/modules/two-factor/use-cases/disable-two-factor.use-case"

import { createAuthSessionFixture } from "~/src/integrations/better-auth/__test__/fixtures/auth.session.fixture"
import { RoleCode } from "~/src/integrations/better-auth/auth.access"
import type { auth } from "~/src/integrations/better-auth/auth.server"
import * as authServer from "~/src/integrations/better-auth/auth.server"

const HEADERS = new Headers()
const USER_ID = "01900000-0000-7000-8000-000000000001"

type AuthApi = typeof auth.api

const disableTwoFactorMock = vi.hoisted(() => vi.fn<AuthApi["disableTwoFactor"]>())
const getSessionMock = vi.hoisted(() => vi.fn<AuthApi["getSession"]>())

vi.mock(import("server-only"), () => ({}))

vi.mock(
  import("next/headers"),
  (): Partial<typeof NextHeadersModule> => ({
    headers: vi.fn<() => Promise<Headers>>(() => Promise.resolve(HEADERS)),
  }),
)

describe("disable-two-factor", () => {
  it("calls auth.api.disableTwoFactor for admins", async () => {
    expect.hasAssertions()
    disableTwoFactorMock.mockReset()
    getSessionMock.mockReset()
    vi.spyOn(authServer.auth.api, "getSession").mockImplementation(getSessionMock)
    vi.spyOn(authServer.auth.api, "disableTwoFactor").mockImplementation(disableTwoFactorMock)
    getSessionMock.mockResolvedValue(createAuthSessionFixture({ role: RoleCode.ADMIN, userId: USER_ID }))
    disableTwoFactorMock.mockResolvedValue({ status: true })

    await expect(disableTwoFactor({ password: "Secret1!" })).resolves.toMatchObject({
      data: { status: true },
    })
    expect(disableTwoFactorMock).toHaveBeenCalledWith({ body: { password: "Secret1!" }, headers: HEADERS })
  })

  it("returns a domain error when the caller lacks settings access", async () => {
    expect.hasAssertions()
    getSessionMock.mockReset()
    vi.spyOn(authServer.auth.api, "getSession").mockImplementation(getSessionMock)
    getSessionMock.mockResolvedValue(createAuthSessionFixture({ role: RoleCode.CUSTOMER, userId: USER_ID }))

    await expect(disableTwoFactor({ password: "Secret1!" })).resolves.toMatchObject({
      serverError: { code: "FORBIDDEN" },
    })
  })
})
