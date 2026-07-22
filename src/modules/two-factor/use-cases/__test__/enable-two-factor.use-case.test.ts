import type * as NextHeadersModule from "next/headers"

import { enableTwoFactor } from "~/src/modules/two-factor/use-cases/enable-two-factor.use-case"

import { createAuthSessionFixture } from "~/src/integrations/better-auth/__test__/fixtures/auth.session.fixture"
import { RoleCode } from "~/src/integrations/better-auth/auth.access"
import type { auth } from "~/src/integrations/better-auth/auth.server"
import * as authServer from "~/src/integrations/better-auth/auth.server"

const HEADERS = new Headers()
const USER_ID = "01900000-0000-7000-8000-000000000001"

type AuthApi = typeof auth.api

const enableTwoFactorMock = vi.hoisted(() => vi.fn<AuthApi["enableTwoFactor"]>())
const getSessionMock = vi.hoisted(() => vi.fn<AuthApi["getSession"]>())

vi.mock(import("server-only"), () => ({}))

vi.mock(
  import("next/headers"),
  (): Partial<typeof NextHeadersModule> => ({
    headers: vi.fn<() => Promise<Headers>>(() => Promise.resolve(HEADERS)),
  }),
)

describe("enable-two-factor", () => {
  it("calls auth.api.enableTwoFactor for admins", async () => {
    expect.hasAssertions()
    enableTwoFactorMock.mockReset()
    getSessionMock.mockReset()
    vi.spyOn(authServer.auth.api, "getSession").mockImplementation(getSessionMock)
    vi.spyOn(authServer.auth.api, "enableTwoFactor").mockImplementation(enableTwoFactorMock)
    getSessionMock.mockResolvedValue(createAuthSessionFixture({ role: RoleCode.ADMIN, userId: USER_ID }))
    enableTwoFactorMock.mockResolvedValue({ backupCodes: ["code-1"], totpURI: "otpauth://totp" })

    await expect(enableTwoFactor({ password: "Secret1!" })).resolves.toMatchObject({
      data: { backupCodes: ["code-1"], totpURI: "otpauth://totp" },
    })
    expect(enableTwoFactorMock).toHaveBeenCalledWith({ body: { password: "Secret1!" }, headers: HEADERS })
  })

  it("returns a domain error when the caller lacks settings access", async () => {
    expect.hasAssertions()
    getSessionMock.mockReset()
    vi.spyOn(authServer.auth.api, "getSession").mockImplementation(getSessionMock)
    getSessionMock.mockResolvedValue(createAuthSessionFixture({ role: RoleCode.CUSTOMER, userId: USER_ID }))

    await expect(enableTwoFactor({ password: "Secret1!" })).resolves.toMatchObject({
      serverError: { code: "FORBIDDEN" },
    })
  })
})
