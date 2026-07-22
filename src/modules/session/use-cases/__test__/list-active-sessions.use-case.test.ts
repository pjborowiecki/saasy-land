import { ForbiddenError } from "~/src/modules/_core/errors/forbidden.error"
import { listActiveSessions } from "~/src/modules/session/use-cases/list-active-sessions.use-case"

import { createAuthSessionFixture } from "~/src/integrations/better-auth/__test__/fixtures/auth.session.fixture"
import { RoleCode } from "~/src/integrations/better-auth/auth.access"
import type { auth } from "~/src/integrations/better-auth/auth.server"
import * as authServer from "~/src/integrations/better-auth/auth.server"
import type * as authSession from "~/src/integrations/better-auth/auth.session"

const HEADERS = new Headers()
const USER_ID = "01900000-0000-7000-8000-000000000001"
const UPDATED_AT = new Date("2026-07-21T12:00:00.000Z")

type AuthApi = typeof auth.api

const getCurrentSessionMock = vi.hoisted(() => vi.fn<typeof authSession.getCurrentSession>())
const listSessionsMock = vi.hoisted(() => vi.fn<AuthApi["listSessions"]>())

vi.mock(import("server-only"), () => ({}))

vi.mock(import("~/src/integrations/better-auth/auth.session"), () => ({
  getCurrentSession: getCurrentSessionMock,
}))

function resetAuthApiMocks(): void {
  getCurrentSessionMock.mockReset()
  listSessionsMock.mockReset()
  vi.spyOn(authServer.auth.api, "listSessions").mockImplementation(listSessionsMock)
}

describe("list-active-sessions", () => {
  it("lists active sessions for admins", async () => {
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
    getCurrentSessionMock.mockResolvedValue(createAuthSessionFixture({ role: RoleCode.ADMIN, userId: USER_ID }))

    await expect(listActiveSessions(HEADERS)).resolves.toStrictEqual([session])
    expect(listSessionsMock).toHaveBeenCalledWith({ headers: HEADERS })
    expect(getCurrentSessionMock).toHaveBeenCalledWith()
  })

  it("rejects callers without settings access", async () => {
    expect.hasAssertions()
    resetAuthApiMocks()
    getCurrentSessionMock.mockResolvedValue(createAuthSessionFixture({ role: RoleCode.CUSTOMER, userId: USER_ID }))

    await expect(listActiveSessions(HEADERS)).rejects.toThrow(ForbiddenError)
    expect(listSessionsMock).not.toHaveBeenCalled()
  })
})
