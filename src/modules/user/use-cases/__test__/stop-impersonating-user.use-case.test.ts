import type * as NextHeadersModule from "next/headers"

import { stopImpersonatingUser } from "~/src/modules/user/use-cases/stop-impersonating-user.use-case"

import {
  createAuthSessionFixture,
  createMissingAuthSessionResult,
} from "~/src/integrations/better-auth/__test__/fixtures/auth.session.fixture"
import { RoleCode } from "~/src/integrations/better-auth/auth.access"
import type { auth } from "~/src/integrations/better-auth/auth.server"
import * as authServer from "~/src/integrations/better-auth/auth.server"

const HEADERS = new Headers()
const ADMIN_USER_ID = "01900000-0000-7000-8000-000000000001"
const FIXTURE_DATE = new Date("2024-01-01T00:00:00.000Z")

type AuthApi = typeof auth.api

const getSessionMock = vi.hoisted(() => vi.fn<AuthApi["getSession"]>())
const stopImpersonatingMock = vi.hoisted(() => vi.fn<AuthApi["stopImpersonating"]>())

vi.mock(import("server-only"), () => ({}))

vi.mock(
  import("next/headers"),
  (): Partial<typeof NextHeadersModule> => ({
    headers: vi.fn<() => Promise<Headers>>(() => Promise.resolve(HEADERS)),
  }),
)

describe("stop-impersonating-user", () => {
  it("stops impersonating when the caller is an admin", async () => {
    expect.hasAssertions()
    getSessionMock.mockReset()
    stopImpersonatingMock.mockReset()
    vi.spyOn(authServer.auth.api, "getSession").mockImplementation(getSessionMock)
    vi.spyOn(authServer.auth.api, "stopImpersonating").mockImplementation(stopImpersonatingMock)
    getSessionMock.mockResolvedValue(createAuthSessionFixture({ role: RoleCode.ADMIN, userId: ADMIN_USER_ID }))
    const stopResult = {
      session: {
        createdAt: FIXTURE_DATE,
        expiresAt: FIXTURE_DATE,
        id: "01900000-0000-7000-8000-000000000003",
        token: "admin-session-token",
        updatedAt: FIXTURE_DATE,
        userId: ADMIN_USER_ID,
      },
      user: createAuthSessionFixture({ role: RoleCode.ADMIN, userId: ADMIN_USER_ID }).user,
    }
    stopImpersonatingMock.mockResolvedValue(stopResult)

    await expect(stopImpersonatingUser()).resolves.toMatchObject({ data: stopResult })
    expect(stopImpersonatingMock).toHaveBeenCalledWith({ headers: HEADERS })
  })

  it("returns a domain error when the caller is not signed in", async () => {
    expect.hasAssertions()
    getSessionMock.mockReset()
    vi.spyOn(authServer.auth.api, "getSession").mockImplementation(getSessionMock)
    getSessionMock.mockResolvedValue(createMissingAuthSessionResult())

    await expect(stopImpersonatingUser()).resolves.toMatchObject({
      serverError: { code: "UNAUTHORIZED" },
    })
  })
})
