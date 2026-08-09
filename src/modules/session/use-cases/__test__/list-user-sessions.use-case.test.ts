import type * as NextHeadersModule from "next/headers"

import { listUserSessions } from "~/src/modules/session/use-cases/list-user-sessions.use-case"

import { createAuthSessionFixture } from "~/src/integrations/better-auth/__test__/fixtures/auth.session.fixture"
import { ROLE_CODES } from "~/src/integrations/better-auth/auth.access"
import type { auth } from "~/src/integrations/better-auth/auth.server"
import * as authServer from "~/src/integrations/better-auth/auth.server"

const HEADERS = new Headers()
const TARGET_USER_ID = "01900000-0000-7000-8000-000000000002"
const ADMIN_USER_ID = "01900000-0000-7000-8000-000000000001"
const FIXTURE_DATE = new Date("2024-01-01T00:00:00.000Z")

type AuthApi = typeof auth.api

const getSessionMock = vi.hoisted(() => vi.fn<AuthApi["getSession"]>())
const listUserSessionsMock = vi.hoisted(() => vi.fn<AuthApi["listUserSessions"]>())

vi.mock(import("server-only"), () => ({}))

vi.mock(
  import("next/headers"),
  (): Partial<typeof NextHeadersModule> => ({
    headers: vi.fn<() => Promise<Headers>>(() => Promise.resolve(HEADERS)),
  }),
)

describe("list-user-sessions", () => {
  it("lists sessions when the caller is an admin", async () => {
    expect.hasAssertions()
    getSessionMock.mockReset()
    listUserSessionsMock.mockReset()
    vi.spyOn(authServer.auth.api, "getSession").mockImplementation(getSessionMock)
    vi.spyOn(authServer.auth.api, "listUserSessions").mockImplementation(listUserSessionsMock)
    getSessionMock.mockResolvedValue(createAuthSessionFixture({ role: ROLE_CODES.ADMIN, userId: ADMIN_USER_ID }))
    const sessionsResult = {
      sessions: [
        {
          createdAt: FIXTURE_DATE,
          expiresAt: FIXTURE_DATE,
          id: "01900000-0000-7000-8000-000000000003",
          token: "session-token",
          updatedAt: FIXTURE_DATE,
          userId: TARGET_USER_ID,
        },
      ],
    }
    listUserSessionsMock.mockResolvedValue(sessionsResult)

    await expect(listUserSessions({ userId: TARGET_USER_ID })).resolves.toMatchObject({ data: sessionsResult })
    expect(listUserSessionsMock).toHaveBeenCalledWith({
      body: { userId: TARGET_USER_ID },
      headers: HEADERS,
    })
  })

  it("returns a domain error when the caller is not an admin", async () => {
    expect.hasAssertions()
    getSessionMock.mockReset()
    vi.spyOn(authServer.auth.api, "getSession").mockImplementation(getSessionMock)
    getSessionMock.mockResolvedValue(createAuthSessionFixture({ role: ROLE_CODES.CUSTOMER, userId: ADMIN_USER_ID }))

    await expect(listUserSessions({ userId: TARGET_USER_ID })).resolves.toMatchObject({
      serverError: { code: "FORBIDDEN" },
    })
  })
})
