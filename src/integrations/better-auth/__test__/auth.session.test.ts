import { getRequest } from "@tanstack/react-start/server"
import { afterEach, describe, expect, it, vi } from "vite-plus/test"

import { executeQuery } from "~/src/platform/testing/lib/query"

import { createAuthSessionFixture } from "~/src/integrations/better-auth/__test__/fixtures/auth.session.fixture"
import { auth } from "~/src/integrations/better-auth/auth.server"
import { getCurrentSessionQuery, getRequestSession } from "~/src/integrations/better-auth/auth.session"

afterEach(() => vi.restoreAllMocks())

describe("current session query", () => {
  it("validates the incoming request's session through Better Auth", async () => {
    const request = new Request("http://localhost/app", { headers: { Cookie: "session-token" } })
    vi.mocked(getRequest).mockReturnValue(request)
    const session = createAuthSessionFixture()
    const getSession = vi.spyOn(auth.api, "getSession").mockResolvedValue(session)

    await expect(executeQuery(getCurrentSessionQuery)).resolves.toEqual(session)
    expect(getSession).toHaveBeenCalledExactlyOnceWith({ headers: request.headers, query: { disableCookieCache: true } })
  })
})

describe("request session lookup", () => {
  it("shares concurrent and sequential reads in one request", async () => {
    const request = new Request("http://localhost/app")
    const session = createAuthSessionFixture()
    const pending = Promise.withResolvers<typeof session>()
    const getSession = vi.spyOn(auth.api, "getSession").mockReturnValue(pending.promise)

    const first = getRequestSession(request)
    const second = getRequestSession(request)
    expect(second).toBe(first)
    pending.resolve(session)
    await expect(first).resolves.toEqual(session)
    await expect(getRequestSession(request)).resolves.toEqual(session)
    expect(getSession).toHaveBeenCalledExactlyOnceWith({ headers: request.headers, query: { disableCookieCache: true } })
  })

  it("also reuses a signed-out result within the request", async () => {
    const request = new Request("http://localhost/app")
    const getSession = vi.spyOn(auth.api, "getSession").mockResolvedValue(null)

    await expect(getRequestSession(request)).resolves.toBeNull()
    await expect(getRequestSession(request)).resolves.toBeNull()
    expect(getSession).toHaveBeenCalledOnce()
  })

  it("does not query session storage for a visitor without a session cookie", async () => {
    const context = await auth.$context
    const findSession = vi.spyOn(context.internalAdapter, "findSession")
    const request = new Request("http://localhost:3000/app", { headers: { host: "localhost:3000" } })

    await expect(getRequestSession(request)).resolves.toBeNull()
    expect(findSession).not.toHaveBeenCalled()
  })

  it("rechecks subsequent requests with identical cookies and observes revocation", async () => {
    const headers = { Cookie: "same-session-token" }
    const getSession = vi.spyOn(auth.api, "getSession").mockResolvedValueOnce(createAuthSessionFixture()).mockResolvedValueOnce(null)

    await expect(getRequestSession(new Request("http://localhost/app", { headers }))).resolves.not.toBeNull()
    await expect(getRequestSession(new Request("http://localhost/app", { headers }))).resolves.toBeNull()
    expect(getSession).toHaveBeenCalledTimes(2)
  })

  it("keeps simultaneous users separate when their lookups finish out of order", async () => {
    const firstSession = createAuthSessionFixture()
    const secondSession = createAuthSessionFixture({ userId: "another-user" })
    const firstPending = Promise.withResolvers<typeof firstSession>()
    const secondPending = Promise.withResolvers<typeof secondSession>()
    const getSession = vi.spyOn(auth.api, "getSession").mockReturnValueOnce(firstPending.promise).mockReturnValueOnce(secondPending.promise)
    const firstRequest = new Request("http://localhost/app", { headers: { Cookie: "first-user" } })
    const secondRequest = new Request("http://localhost/app", { headers: { Cookie: "second-user" } })

    const first = getRequestSession(firstRequest)
    const second = getRequestSession(secondRequest)
    expect(getRequestSession(firstRequest)).toBe(first)
    expect(getRequestSession(secondRequest)).toBe(second)
    secondPending.resolve(secondSession)
    await expect(second).resolves.toEqual(secondSession)
    firstPending.resolve(firstSession)
    await expect(first).resolves.toEqual(firstSession)
    expect(getSession).toHaveBeenCalledTimes(2)
  })

  it("shares a failed lookup within the request and rejects every caller", async () => {
    const request = new Request("http://localhost/app")
    const failure = new Error("database unavailable")
    const pending = Promise.withResolvers<never>()
    const getSession = vi.spyOn(auth.api, "getSession").mockReturnValue(pending.promise)

    const first = getRequestSession(request)
    const second = getRequestSession(request)
    expect(second).toBe(first)
    pending.reject(failure)
    await expect(first).rejects.toBe(failure)
    await expect(second).rejects.toBe(failure)
    await expect(getRequestSession(request)).rejects.toBe(failure)
    expect(getSession).toHaveBeenCalledOnce()
  })

  it("does not retain a failed read for the next request", async () => {
    const failure = new Error("database unavailable")
    const session = createAuthSessionFixture()
    const getSession = vi.spyOn(auth.api, "getSession").mockRejectedValueOnce(failure).mockResolvedValueOnce(session)

    await expect(getRequestSession(new Request("http://localhost/app"))).rejects.toBe(failure)
    await expect(getRequestSession(new Request("http://localhost/app"))).resolves.toEqual(session)
    expect(getSession).toHaveBeenCalledTimes(2)
  })
})
