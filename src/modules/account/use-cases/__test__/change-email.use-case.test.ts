import type * as NextHeadersModule from "next/headers"

import { settingsChangeEmail } from "~/src/modules/account/use-cases/change-email.use-case"

import { createAuthSessionFixture } from "~/src/integrations/better-auth/__test__/fixtures/auth.session.fixture"
import { RoleCode } from "~/src/integrations/better-auth/auth.access"
import type { auth } from "~/src/integrations/better-auth/auth.server"
import * as authServer from "~/src/integrations/better-auth/auth.server"

const HEADERS = new Headers()
const USER_ID = "01900000-0000-7000-8000-000000000001"

type AuthApi = typeof auth.api

const getSessionMock = vi.hoisted(() => vi.fn<AuthApi["getSession"]>())
const changeEmailMock = vi.hoisted(() => vi.fn<AuthApi["changeEmail"]>())

vi.mock(import("server-only"), () => ({}))

vi.mock(
  import("next/headers"),
  (): Partial<typeof NextHeadersModule> => ({
    headers: vi.fn<() => Promise<Headers>>(() => Promise.resolve(HEADERS)),
  }),
)

describe("change-email", () => {
  it("changes the signed-in admin email", async () => {
    expect.hasAssertions()
    getSessionMock.mockReset()
    changeEmailMock.mockReset()
    vi.spyOn(authServer.auth.api, "getSession").mockImplementation(getSessionMock)
    vi.spyOn(authServer.auth.api, "changeEmail").mockImplementation(changeEmailMock)
    getSessionMock.mockResolvedValue(createAuthSessionFixture({ role: RoleCode.ADMIN, userId: USER_ID }))
    changeEmailMock.mockResolvedValue({ status: true })

    await expect(settingsChangeEmail({ newEmail: "ada@example.com" })).resolves.toMatchObject({ data: { status: true } })
  })

  it("returns a domain error when the caller lacks settings access", async () => {
    expect.hasAssertions()
    getSessionMock.mockReset()
    vi.spyOn(authServer.auth.api, "getSession").mockImplementation(getSessionMock)
    getSessionMock.mockResolvedValue(createAuthSessionFixture({ role: RoleCode.CUSTOMER, userId: USER_ID }))

    await expect(settingsChangeEmail({ newEmail: "ada@example.com" })).resolves.toMatchObject({
      serverError: { code: "FORBIDDEN" },
    })
  })
})
