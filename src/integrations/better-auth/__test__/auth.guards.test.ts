import { ForbiddenError } from "~/src/modules/_core/errors/forbidden.error"
import { UnauthorizedError } from "~/src/modules/_core/errors/unauthorized.error"

import {
  createAuthSessionFixture,
  createMissingAuthSessionResult,
} from "~/src/integrations/better-auth/__test__/fixtures/auth.session.fixture"
import { PERMISSIONS, RoleCode } from "~/src/integrations/better-auth/auth.access"
import { requireAuthenticatedSession, requirePermissionSession } from "~/src/integrations/better-auth/auth.guards"
import type * as authSession from "~/src/integrations/better-auth/auth.session"

const USER_ID = "01900000-0000-7000-8000-000000000001"

const getCurrentSessionMock = vi.hoisted(() => vi.fn<typeof authSession.getCurrentSession>())

vi.mock(import("server-only"), () => ({}))

vi.mock(import("~/src/integrations/better-auth/auth.session"), () => ({
  getCurrentSession: getCurrentSessionMock,
}))

function resetGetCurrentSessionMock(): void {
  getCurrentSessionMock.mockReset()
}

describe("require permission session", () => {
  it("returns a session when the role grants the permission", async () => {
    expect.hasAssertions()
    resetGetCurrentSessionMock()
    getCurrentSessionMock.mockResolvedValue(createAuthSessionFixture({ role: RoleCode.ADMIN, userId: USER_ID }))

    await expect(requirePermissionSession(PERMISSIONS.user.list)).resolves.toStrictEqual({
      user: { id: USER_ID, role: RoleCode.ADMIN },
    })
    expect(getCurrentSessionMock).toHaveBeenCalledWith()
  })

  it("rejects a missing session", async () => {
    expect.hasAssertions()
    resetGetCurrentSessionMock()
    getCurrentSessionMock.mockResolvedValue(createMissingAuthSessionResult())

    await expect(requirePermissionSession(PERMISSIONS.user.list)).rejects.toThrow(UnauthorizedError)
  })

  it("rejects a session without the requested permission", async () => {
    expect.hasAssertions()
    resetGetCurrentSessionMock()
    getCurrentSessionMock.mockResolvedValue(createAuthSessionFixture({ role: RoleCode.CUSTOMER, userId: USER_ID }))

    await expect(requirePermissionSession(PERMISSIONS.user.list)).rejects.toThrow(ForbiddenError)
  })

  it("rejects a session with a non-string role", async () => {
    expect.hasAssertions()
    resetGetCurrentSessionMock()
    const fixture = createAuthSessionFixture({ userId: USER_ID })
    const { role: _ignoredRole, ...userWithoutRole } = fixture.user
    getCurrentSessionMock.mockResolvedValue({ ...fixture, user: userWithoutRole })

    await expect(requirePermissionSession(PERMISSIONS.user.list)).rejects.toThrow(ForbiddenError)
  })
})

describe("require authenticated session", () => {
  it("returns an authenticated session", async () => {
    expect.hasAssertions()
    resetGetCurrentSessionMock()
    getCurrentSessionMock.mockResolvedValue(createAuthSessionFixture({ role: RoleCode.CUSTOMER, userId: USER_ID }))

    await expect(requireAuthenticatedSession()).resolves.toStrictEqual({ user: { id: USER_ID, role: RoleCode.CUSTOMER } })
  })

  it("returns a session without role when role is absent", async () => {
    expect.hasAssertions()
    resetGetCurrentSessionMock()
    const fixture = createAuthSessionFixture({ userId: USER_ID })
    const { role: _ignoredRole, ...userWithoutRole } = fixture.user
    getCurrentSessionMock.mockResolvedValue({ ...fixture, user: userWithoutRole })

    await expect(requireAuthenticatedSession()).resolves.toStrictEqual({ user: { id: USER_ID } })
  })

  it("rejects an unauthenticated session", async () => {
    expect.hasAssertions()
    resetGetCurrentSessionMock()
    getCurrentSessionMock.mockResolvedValue(createMissingAuthSessionResult())

    await expect(requireAuthenticatedSession()).rejects.toThrow(UnauthorizedError)
  })

  it("rejects a session with an empty user id", async () => {
    expect.hasAssertions()
    resetGetCurrentSessionMock()
    const fixture = createAuthSessionFixture({ userId: USER_ID })
    getCurrentSessionMock.mockResolvedValue({ ...fixture, user: { ...fixture.user, id: "" } })

    await expect(requireAuthenticatedSession()).rejects.toThrow(UnauthorizedError)
  })
})
