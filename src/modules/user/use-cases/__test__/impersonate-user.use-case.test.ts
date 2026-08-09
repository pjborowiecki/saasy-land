import type * as NextHeadersModule from "next/headers"

import { impersonateUser } from "~/src/modules/user/use-cases/impersonate-user.use-case"

import {
  createAuthSessionFixture,
  createAuthUserMutationResult,
} from "~/src/integrations/better-auth/__test__/fixtures/auth.session.fixture"
import { ROLE_CODES } from "~/src/integrations/better-auth/auth.access"
import type { auth } from "~/src/integrations/better-auth/auth.server"
import * as authServer from "~/src/integrations/better-auth/auth.server"

const HEADERS = new Headers()
const TARGET_USER_ID = "01900000-0000-7000-8000-000000000002"
const ADMIN_USER_ID = "01900000-0000-7000-8000-000000000001"
const FIXTURE_DATE = new Date("2024-01-01T00:00:00.000Z")

type AuthApi = typeof auth.api

const getSessionMock = vi.hoisted(() => vi.fn<AuthApi["getSession"]>())
const impersonateUserMock = vi.hoisted(() => vi.fn<AuthApi["impersonateUser"]>())

vi.mock(import("server-only"), () => ({}))

vi.mock(
  import("next/headers"),
  (): Partial<typeof NextHeadersModule> => ({
    headers: vi.fn<() => Promise<Headers>>(() => Promise.resolve(HEADERS)),
  }),
)

describe("impersonate-user", () => {
  it("impersonates a user when the caller is an admin", async () => {
    expect.hasAssertions()
    getSessionMock.mockReset()
    impersonateUserMock.mockReset()
    vi.spyOn(authServer.auth.api, "getSession").mockImplementation(getSessionMock)
    vi.spyOn(authServer.auth.api, "impersonateUser").mockImplementation(impersonateUserMock)
    getSessionMock.mockResolvedValue(createAuthSessionFixture({ role: ROLE_CODES.ADMIN, userId: ADMIN_USER_ID }))
    const impersonationResult = {
      session: {
        createdAt: FIXTURE_DATE,
        expiresAt: FIXTURE_DATE,
        id: "01900000-0000-7000-8000-000000000003",
        token: "impersonated-session-token",
        updatedAt: FIXTURE_DATE,
        userId: TARGET_USER_ID,
      },
      user: createAuthUserMutationResult({ userId: TARGET_USER_ID }).user,
    }
    impersonateUserMock.mockResolvedValue(impersonationResult)

    await expect(impersonateUser({ userId: TARGET_USER_ID })).resolves.toMatchObject({ data: impersonationResult })
    expect(impersonateUserMock).toHaveBeenCalledWith({
      body: { userId: TARGET_USER_ID },
      headers: HEADERS,
    })
  })

  it("returns a domain error when the caller is not an admin", async () => {
    expect.hasAssertions()
    getSessionMock.mockReset()
    vi.spyOn(authServer.auth.api, "getSession").mockImplementation(getSessionMock)
    getSessionMock.mockResolvedValue(createAuthSessionFixture({ role: ROLE_CODES.CUSTOMER, userId: ADMIN_USER_ID }))

    await expect(impersonateUser({ userId: TARGET_USER_ID })).resolves.toMatchObject({
      serverError: { code: "FORBIDDEN" },
    })
  })
})
