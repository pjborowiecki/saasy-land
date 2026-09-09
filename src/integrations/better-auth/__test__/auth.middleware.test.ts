import { env } from "cloudflare:workers"

import { createServerFn } from "@tanstack/react-start"
import { getRequest } from "@tanstack/react-start/server"
import { APIError } from "better-auth/api"
import { afterEach, beforeEach, describe, expect, it, vi } from "vite-plus/test"
import { z as zod } from "zod"

import { createAuthSessionFixture } from "~/src/integrations/better-auth/__test__/fixtures/auth.session.fixture"
import { RATE_LIMITS, authorized, withRateLimit, withRequest } from "~/src/integrations/better-auth/auth.middleware"
import { auth } from "~/src/integrations/better-auth/auth.server"
import { getCurrentSession } from "~/src/integrations/better-auth/auth.session"

import { AppError, ERROR_CODES } from "~/src/modules/_core/constants/errors"

beforeEach(() => {
  vi.mocked(getRequest).mockImplementation(() => new Request("http://localhost/app"))
})
afterEach(() => vi.restoreAllMocks())

describe("server function request middleware", () => {
  it("returns data on success", async () => {
    const action = createServerFn()
      .middleware([withRequest])
      .handler(() => "done")
    await expect(action()).resolves.toBe("done")
  })
  it("preserves domain error codes without exposing private details", async () => {
    const action = createServerFn()
      .middleware([withRequest])
      .handler(() => {
        throw new AppError(ERROR_CODES.FORBIDDEN, "details")
      })
    await expect(action()).rejects.toMatchObject({ code: ERROR_CODES.FORBIDDEN, message: "FORBIDDEN" })
  })
  it("maps Better Auth errors to their translation key", async () => {
    const action = createServerFn()
      .middleware([withRequest])
      .handler(() => {
        throw new APIError("BAD_REQUEST", { code: "INVALID_PASSWORD", message: "Invalid password" })
      })
    await expect(action()).rejects.toThrow("invalidPassword")
  })
  it("masks unexpected failures", async () => {
    vi.spyOn(console, "error").mockImplementation(() => {})
    const action = createServerFn()
      .middleware([withRequest])
      .handler(() => {
        throw new Error("private database details")
      })
    await expect(action()).rejects.toThrow("INTERNAL_ERROR")
  })
  it("masks asynchronous failures and logs the original error only on the server", async () => {
    const error = new Error("private database details")
    const log = vi.spyOn(console, "error").mockImplementation(() => {})
    const action = createServerFn()
      .middleware([withRequest])
      .handler(() => Promise.reject(error))

    await expect(action()).rejects.toMatchObject({ code: ERROR_CODES.INTERNAL_ERROR, message: "INTERNAL_ERROR" })
    expect(log).toHaveBeenCalledExactlyOnceWith("Server function failed", error)
  })
  it("preserves request headers through the middleware", async () => {
    const headers = new Headers({ "X-Request-ID": "request-123" })
    vi.mocked(getRequest).mockReturnValue(new Request("http://localhost/", { headers }))
    const action = createServerFn()
      .middleware([withRequest])
      .handler(({ context }) => context.requestHeaders.get("X-Request-ID"))

    await expect(action()).resolves.toBe("request-123")
  })
  it("rejects invalid input before the handler runs", async () => {
    const handler = vi.fn(() => "done")
    const schema = zod.object({ email: zod.email() })
    const action = createServerFn()
      .middleware([withRequest])
      .validator((input: zod.input<typeof schema>) => schema.parse(input))
      .handler(handler)
    await expect(action({ data: { email: "invalid" } })).rejects.toThrow("VALIDATION")
    expect(handler).not.toHaveBeenCalled()
  })
})
describe("authorization middleware", () => {
  it("shares one session read across the route and multiple permission checks in the same request", async () => {
    vi.mocked(getRequest).mockReturnValue(new Request("http://localhost/admin"))
    const session = createAuthSessionFixture({ role: "admin" })
    const getSession = vi.spyOn(auth.api, "getSession").mockResolvedValue(session)
    await getCurrentSession()
    const action = createServerFn()
      .middleware([authorized({ user: ["list"] }), authorized({ product: ["read"] })])
      .handler(({ context }) => context.auth.user.id)
    await expect(action()).resolves.toBe(session.user.id)
    expect(getSession).toHaveBeenCalledOnce()
  })

  it("rejects signed-out callers", async () => {
    vi.spyOn(auth.api, "getSession").mockResolvedValue(null)
    await expect(
      createServerFn()
        .middleware([authorized()])
        .handler(() => "secret")(),
    ).rejects.toThrow("UNAUTHORIZED")
  })
  it("rejects roles without permission", async () => {
    vi.spyOn(auth.api, "getSession").mockResolvedValue(createAuthSessionFixture({ role: "customer" }))
    await expect(
      createServerFn()
        .middleware([authorized({ user: ["list"] })])
        .handler(() => "secret")(),
    ).rejects.toThrow("FORBIDDEN")
  })
  it("provides the authenticated session to permitted handlers", async () => {
    const session = createAuthSessionFixture({ role: "admin" })
    vi.spyOn(auth.api, "getSession").mockResolvedValue(session)
    const action = createServerFn()
      .middleware([authorized({ user: ["list"] })])
      .handler(({ context }) => context.auth.user.id)
    await expect(action()).resolves.toBe(session.user.id)
  })
  it("only requires a session when permission is omitted", async () => {
    vi.spyOn(auth.api, "getSession").mockResolvedValue(createAuthSessionFixture({ role: "customer" }))
    await expect(
      createServerFn()
        .middleware([authorized()])
        .handler(() => "secret")(),
    ).resolves.toBe("secret")
  })
})
describe("rate limiting middleware", () => {
  it("uses Cloudflare's client IP and a separate action key", async () => {
    vi.mocked(getRequest).mockReturnValue(new Request("http://localhost/", { headers: { "CF-Connecting-IP": "203.0.113.1" } }))
    const action = createServerFn()
      .middleware([withRateLimit("test", RATE_LIMITS.SENSITIVE)])
      .handler(() => "done")
    await expect(action()).resolves.toBe("done")
    expect(await env.CACHE.get("test:203.0.113.1")).toBe("1")
  })
  it("rejects attempts over the configured limit", async () => {
    const action = createServerFn()
      .middleware([withRateLimit("test", RATE_LIMITS.SENSITIVE)])
      .handler(() => "done")
    for (let count = 0; count < RATE_LIMITS.SENSITIVE.max; count++) {
      await action()
    }
    await expect(action()).rejects.toThrow("TOO_MANY_REQUESTS")
  })
  it("stays available when its storage is unavailable", async () => {
    vi.spyOn(env.CACHE, "get").mockRejectedValueOnce(new Error("offline"))
    const action = createServerFn()
      .middleware([withRateLimit("test", RATE_LIMITS.SENSITIVE)])
      .handler(() => "done")
    await expect(action()).resolves.toBe("done")
  })
})
