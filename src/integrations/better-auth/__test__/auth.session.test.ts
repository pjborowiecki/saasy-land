import type * as NextHeadersModule from "next/headers"

import type { auth } from "~/src/integrations/better-auth/auth.server"
import * as authServer from "~/src/integrations/better-auth/auth.server"
import { getCurrentSession } from "~/src/integrations/better-auth/auth.session"

const CALL_COUNT = 1
const FIXTURE_DATE = new Date("2024-01-01T00:00:00.000Z")
const FIXTURE_USER_ID = "00000000-0000-4000-8000-000000000001"
const FIXTURE_SESSION_ID = "00000000-0000-4000-8000-000000000002"
const FIXTURE_SESSION_TOKEN = "fixture-session-token"

type GetSessionFn = typeof auth.api.getSession
type SessionResult = NonNullable<Awaited<ReturnType<GetSessionFn>>>

const getSessionMock = vi.hoisted(() => vi.fn<GetSessionFn>())

vi.mock(import("server-only"), () => ({}))

vi.mock(
  import("next/headers"),
  (): Partial<typeof NextHeadersModule> => ({
    headers: vi.fn<() => Promise<Headers>>(() => Promise.resolve(new Headers())),
  }),
)

function createSession(): SessionResult {
  return {
    session: {
      createdAt: FIXTURE_DATE,
      expiresAt: FIXTURE_DATE,
      id: FIXTURE_SESSION_ID,
      token: FIXTURE_SESSION_TOKEN,
      updatedAt: FIXTURE_DATE,
      userId: FIXTURE_USER_ID,
    },
    user: {
      banned: false,
      createdAt: FIXTURE_DATE,
      email: "test@example.com",
      emailVerified: true,
      id: FIXTURE_USER_ID,
      isAnonymous: false,
      name: "Test User",
      role: "user",
      twoFactorEnabled: false,
      updatedAt: FIXTURE_DATE,
    },
  }
}

function resetSessionMock(): void {
  getSessionMock.mockReset()
  vi.spyOn(authServer.auth.api, "getSession").mockImplementation(getSessionMock)
}

describe("get current session component", () => {
  it("delegates to auth.api.getSession", async () => {
    expect.hasAssertions()
    resetSessionMock()
    const session = createSession()
    getSessionMock.mockResolvedValue(session)

    await expect(getCurrentSession()).resolves.toStrictEqual(session)
    expect(getSessionMock).toHaveBeenCalledTimes(CALL_COUNT)
  })
})
