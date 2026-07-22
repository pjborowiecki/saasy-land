import { NextRequest, NextResponse } from "next/server"

import { createTestRequestUrl } from "~/src/platform/testing/lib/test-request"

import { PERMISSIONS } from "~/src/integrations/better-auth/auth.access"
import type { auth } from "~/src/integrations/better-auth/auth.server"
import * as authServer from "~/src/integrations/better-auth/auth.server"

import { proxy } from "~/src/proxy"
import { ROUTES } from "~/src/routes"

const CALL_COUNT = 1
const HTTP_OK = 200
const REDIRECT_STATUS_MIN = 300
const FIXTURE_DATE = new Date("2024-01-01T00:00:00.000Z")
const FIXTURE_USER_ID = "00000000-0000-4000-8000-000000000001"
const FIXTURE_SESSION_ID = "00000000-0000-4000-8000-000000000002"
const FIXTURE_SESSION_TOKEN = "fixture-session-token"

type GetSessionFn = typeof auth.api.getSession
type SessionResult = NonNullable<Awaited<ReturnType<GetSessionFn>>>

function createSession(role: string): SessionResult {
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
      role,
      twoFactorEnabled: false,
      updatedAt: FIXTURE_DATE,
    },
  }
}

const { getSessionMock, intlMiddlewareMock } = vi.hoisted(() => {
  const middleware = vi.fn<(request: NextRequest) => NextResponse>(() => NextResponse.next())

  return {
    getSessionMock: vi.fn<GetSessionFn>(),
    intlMiddlewareMock: middleware,
  }
})

vi.mock(import("server-only"), () => ({}))

vi.mock(import("next-intl/middleware"), () => ({
  default: () => intlMiddlewareMock,
}))

function resetProxyMocks(): void {
  getSessionMock.mockReset()
  intlMiddlewareMock.mockClear()
  vi.spyOn(authServer.auth.api, "getSession").mockImplementation(getSessionMock)
}

describe("proxy helper", () => {
  it("redirects auth callback without session to sign-in", async () => {
    expect.hasAssertions()
    resetProxyMocks()

    const response = await proxy(new NextRequest(createTestRequestUrl("/auth/callback")))

    expect(response.status).toBeGreaterThanOrEqual(REDIRECT_STATUS_MIN)
    expect(response.headers.get("location")).toContain(ROUTES.SIGN_IN)
  })

  it("redirects auth callback with admin session to admin", async () => {
    expect.hasAssertions()
    resetProxyMocks()
    getSessionMock.mockResolvedValue(createSession(PERMISSIONS.ROLES.ADMIN))

    const response = await proxy(new NextRequest(createTestRequestUrl("/auth/callback")))

    expect(response.headers.get("location")).toContain(ROUTES.ADMIN)
  })

  it("redirects auth callback with customer session to app", async () => {
    expect.hasAssertions()
    resetProxyMocks()
    getSessionMock.mockResolvedValue(createSession(PERMISSIONS.ROLES.CUSTOMER))

    const response = await proxy(new NextRequest(createTestRequestUrl("/auth/callback")))

    expect(response.headers.get("location")).toContain(ROUTES.APP)
  })

  it("redirects unauthenticated app routes to sign-in", async () => {
    expect.hasAssertions()
    resetProxyMocks()

    const response = await proxy(new NextRequest(createTestRequestUrl("/app")))

    expect(response.headers.get("location")).toContain(ROUTES.SIGN_IN)
  })

  it("redirects unauthenticated admin routes to sign-in", async () => {
    expect.hasAssertions()
    resetProxyMocks()

    const response = await proxy(new NextRequest(createTestRequestUrl("/en/admin")))

    expect(response.headers.get("location")).toContain("/en/auth/sign-in")
  })

  it("redirects non-admin users away from admin routes", async () => {
    expect.hasAssertions()
    resetProxyMocks()
    getSessionMock.mockResolvedValue(createSession(PERMISSIONS.ROLES.CUSTOMER))

    const response = await proxy(new NextRequest(createTestRequestUrl("/admin")))

    expect(response.headers.get("location")).toContain(ROUTES.APP)
  })

  it("allows authenticated admin access to admin routes", async () => {
    expect.hasAssertions()
    resetProxyMocks()
    getSessionMock.mockResolvedValue(createSession(PERMISSIONS.ROLES.ADMIN))

    await proxy(new NextRequest(createTestRequestUrl("/admin")))

    expect(intlMiddlewareMock).toHaveBeenCalledTimes(CALL_COUNT)
  })

  it("rewrites bare dashboard paths with locale", async () => {
    expect.hasAssertions()
    resetProxyMocks()

    const response = await proxy(new NextRequest(createTestRequestUrl("/dashboard")))

    expect(response.status).toBe(HTTP_OK)
    expect(intlMiddlewareMock).not.toHaveBeenCalled()
  })

  it("delegates other routes to intl middleware", async () => {
    expect.hasAssertions()
    resetProxyMocks()

    await proxy(new NextRequest(createTestRequestUrl("/about")))

    expect(intlMiddlewareMock).toHaveBeenCalledTimes(CALL_COUNT)
  })
})
