import type * as NextHeadersModule from "next/headers"

import { getActiveSessions } from "~/src/modules/session/use-cases/get-active-sessions.use-case"

import {
  createAuthSessionFixture,
  createMissingAuthSessionResult,
} from "~/src/integrations/better-auth/__test__/fixtures/auth.session.fixture"
import { ROLE_CODES } from "~/src/integrations/better-auth/auth.access"
import type { auth } from "~/src/integrations/better-auth/auth.server"
import * as authServer from "~/src/integrations/better-auth/auth.server"

const HEADERS = new Headers()
const USER_ID = "01900000-0000-7000-8000-000000000001"
const UPDATED_AT = new Date("2026-07-21T12:00:00.000Z")

type AuthApi = typeof auth.api

const getSessionMock = vi.hoisted(() => vi.fn<AuthApi["getSession"]>())
const listSessionsMock = vi.hoisted(() => vi.fn<AuthApi["listSessions"]>())

vi.mock(import("server-only"), () => ({}))

vi.mock(
  import("next/headers"),
  (): Partial<typeof NextHeadersModule> => ({
    headers: vi.fn<() => Promise<Headers>>(() => Promise.resolve(HEADERS)),
  }),
)

function resetAuthApiMocks(): void {
  getSessionMock.mockReset()
  listSessionsMock.mockReset()
  vi.spyOn(authServer.auth.api, "getSession").mockImplementation(getSessionMock)
  vi.spyOn(authServer.auth.api, "listSessions").mockImplementation(listSessionsMock)
}

describe("get-active-sessions", () => {
  it("lists the caller's active sessions", async () => {
    expect.hasAssertions()
    resetAuthApiMocks()
    const session = {
      createdAt: UPDATED_AT,
      expiresAt: UPDATED_AT,
      id: "session-1",
      token: "token-1",
      updatedAt: UPDATED_AT,
      userId: USER_ID,
    }
    listSessionsMock.mockResolvedValue([session])
    getSessionMock.mockResolvedValue(createAuthSessionFixture({ role: ROLE_CODES.CUSTOMER, userId: USER_ID }))

    await expect(getActiveSessions()).resolves.toStrictEqual([session])
    expect(listSessionsMock).toHaveBeenCalledWith({ headers: HEADERS })
  })

  it("rejects when the caller is signed out", async () => {
    expect.hasAssertions()
    resetAuthApiMocks()
    getSessionMock.mockResolvedValue(createMissingAuthSessionResult())

    await expect(getActiveSessions()).rejects.toMatchObject({ digest: "NEXT_HTTP_ERROR_FALLBACK;401" })
    expect(listSessionsMock).not.toHaveBeenCalled()
  })
})
