import { env } from "cloudflare:workers"

import { createServerFn } from "@tanstack/react-start"
import { getRequest } from "@tanstack/react-start/server"
import { APIError } from "better-auth/api"
import { afterEach, describe, expect, it, vi } from "vite-plus/test"
import { z as zod } from "zod"

import { createAuthSessionFixture } from "~/src/integrations/better-auth/__test__/fixtures/auth.session.fixture"
import { RATE_LIMITS, withAuth, withRateLimit, withRequest } from "~/src/integrations/better-auth/auth.middleware"
import { auth } from "~/src/integrations/better-auth/auth.server"

import { AppError, ERROR_CODES } from "~/src/modules/_core/constants/errors"

afterEach(() => vi.restoreAllMocks())

describe("server function request middleware", () => {
  it("returns data on success", async () => {
    const action = createServerFn()
      .middleware([withRequest])
      .handler(() => "done")
    await expect(action()).resolves.toBe("done")
  })
  it("preserves domain error codes", async () => {
    const action = createServerFn()
      .middleware([withRequest])
      .handler(() => {
        throw new AppError(ERROR_CODES.FORBIDDEN, "details")
      })
    await expect(action()).rejects.toThrow("FORBIDDEN")
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
  it("rejects signed-out callers", async () => {
    vi.spyOn(auth.api, "getSession").mockResolvedValue(null)
    await expect(
      createServerFn()
        .middleware([withAuth()])
        .handler(() => "secret")(),
    ).rejects.toThrow("UNAUTHORIZED")
  })
  it("rejects roles without permission", async () => {
    vi.spyOn(auth.api, "getSession").mockResolvedValue(createAuthSessionFixture({ role: "customer" }))
    await expect(
      createServerFn()
        .middleware([withAuth({ user: ["list"] })])
        .handler(() => "secret")(),
    ).rejects.toThrow("FORBIDDEN")
  })
  it("provides the authenticated session to permitted handlers", async () => {
    const session = createAuthSessionFixture({ role: "admin" })
    vi.spyOn(auth.api, "getSession").mockResolvedValue(session)
    const action = createServerFn()
      .middleware([withAuth({ user: ["list"] })])
      .handler(({ context }) => context.auth.user.id)
    await expect(action()).resolves.toBe(session.user.id)
  })
  it("only requires a session when permission is omitted", async () => {
    vi.spyOn(auth.api, "getSession").mockResolvedValue(createAuthSessionFixture({ role: "customer" }))
    await expect(
      createServerFn()
        .middleware([withAuth()])
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
