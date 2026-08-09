import type * as NextHeadersModule from "next/headers"

import { settingsUpdateUser } from "~/src/modules/account/use-cases/update-user.use-case"

import {
  createAuthSessionFixture,
  createMissingAuthSessionResult,
} from "~/src/integrations/better-auth/__test__/fixtures/auth.session.fixture"
import { ROLE_CODES } from "~/src/integrations/better-auth/auth.access"
import type { auth } from "~/src/integrations/better-auth/auth.server"
import * as authServer from "~/src/integrations/better-auth/auth.server"

const HEADERS = new Headers()
const USER_ID = "01900000-0000-7000-8000-000000000001"

type AuthApi = typeof auth.api

const getSessionMock = vi.hoisted(() => vi.fn<AuthApi["getSession"]>())
const updateUserMock = vi.hoisted(() => vi.fn<AuthApi["updateUser"]>())

vi.mock(import("server-only"), () => ({}))

vi.mock(
  import("next/headers"),
  (): Partial<typeof NextHeadersModule> => ({
    headers: vi.fn<() => Promise<Headers>>(() => Promise.resolve(HEADERS)),
  }),
)

describe("update-user", () => {
  it("updates the signed-in admin profile", async () => {
    expect.hasAssertions()
    getSessionMock.mockReset()
    updateUserMock.mockReset()
    vi.spyOn(authServer.auth.api, "getSession").mockImplementation(getSessionMock)
    vi.spyOn(authServer.auth.api, "updateUser").mockImplementation(updateUserMock)
    getSessionMock.mockResolvedValue(createAuthSessionFixture({ role: ROLE_CODES.ADMIN, userId: USER_ID }))
    updateUserMock.mockResolvedValue({ status: true })

    await expect(settingsUpdateUser({ name: "Ada" })).resolves.toMatchObject({ data: { status: true } })
  })

  it("returns a domain error when the caller is not signed in", async () => {
    expect.hasAssertions()
    getSessionMock.mockReset()
    vi.spyOn(authServer.auth.api, "getSession").mockImplementation(getSessionMock)
    getSessionMock.mockResolvedValue(createMissingAuthSessionResult())

    await expect(settingsUpdateUser({ name: "Ada" })).resolves.toMatchObject({
      serverError: { code: "UNAUTHORIZED" },
    })
  })
})
