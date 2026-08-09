import type * as NextHeadersModule from "next/headers"

import { APIError } from "better-auth/api"

import { AppError, ERROR_CODES } from "~/src/modules/_core/constants/errors"

import {
  createAuthSessionFixture,
  createMissingAuthSessionResult,
} from "~/src/integrations/better-auth/__test__/fixtures/auth.session.fixture"
import { ROLE_CODES } from "~/src/integrations/better-auth/auth.access"
import type { auth } from "~/src/integrations/better-auth/auth.server"
import * as authServer from "~/src/integrations/better-auth/auth.server"
import { actionClient, RATE_LIMITS, withAuth, withRateLimit } from "~/src/integrations/next-safe-action/action.client"

const OVER_LIMIT_INCREMENT = 1
const USER_ID = "01900000-0000-7000-8000-000000000001"

type AuthApi = typeof auth.api

const getSessionMock = vi.hoisted(() => vi.fn<AuthApi["getSession"]>())

vi.mock(import("server-only"), () => ({}))

const redisMocks = vi.hoisted(() => ({
  expire: vi.fn<(key: string, seconds: number) => Promise<number>>(),
  incr: vi.fn<(key: string) => Promise<number>>(),
}))

// @ts-expect-error Vitest module mock factory is not inferred for the redis client export.
vi.mock(import("~/src/integrations/redis/redis.config"), () => ({ redis: redisMocks }))

vi.mock(
  import("next/headers"),
  (): Partial<typeof NextHeadersModule> => ({
    headers: vi.fn<() => Promise<Headers>>(() => Promise.resolve(new Headers())),
  }),
)

function mockSession(result: Awaited<ReturnType<AuthApi["getSession"]>>): void {
  getSessionMock.mockReset()
  vi.spyOn(authServer.auth.api, "getSession").mockImplementation(getSessionMock)
  getSessionMock.mockResolvedValue(result)
}

describe("action client", () => {
  it("returns data on success", async () => {
    expect.hasAssertions()

    const succeed = actionClient.action(() => Promise.resolve("done"))

    await expect(succeed()).resolves.toMatchObject({ data: "done" })
  })

  it("maps domain errors to serverError", async () => {
    expect.hasAssertions()

    const fail = actionClient.action(() => {
      throw new AppError(ERROR_CODES.FORBIDDEN, "nope")
    })

    await expect(fail()).resolves.toMatchObject({
      serverError: { code: "FORBIDDEN", message: "nope" },
    })
  })

  it("maps better auth api errors to their auth message key", async () => {
    expect.hasAssertions()

    const fail = actionClient.action(() => {
      throw new APIError("BAD_REQUEST", { code: "INVALID_PASSWORD", message: "Invalid password" })
    })

    await expect(fail()).resolves.toMatchObject({
      serverError: { code: "AUTH_API_ERROR", message: "invalidPassword" },
    })
  })

  it("masks unexpected errors as a generic internal serverError", async () => {
    expect.hasAssertions()

    const boom = actionClient.action(() => {
      throw new Error("boom")
    })

    const result = await boom()

    expect(result.serverError?.code).toBe("INTERNAL_ERROR")
    expect(result.serverError?.message).not.toContain("boom")
  })
})

describe("with auth middleware", () => {
  it("rejects signed-out callers with an unauthorized serverError", async () => {
    expect.hasAssertions()
    mockSession(createMissingAuthSessionResult())

    const guarded = actionClient.use(withAuth()).action(() => Promise.resolve("secret"))

    await expect(guarded()).resolves.toMatchObject({
      serverError: { code: "UNAUTHORIZED" },
    })
  })

  it("rejects callers whose role lacks the permission", async () => {
    expect.hasAssertions()
    mockSession(createAuthSessionFixture({ role: ROLE_CODES.CUSTOMER, userId: USER_ID }))

    const guarded = actionClient.use(withAuth({ user: ["list"] })).action(() => Promise.resolve("secret"))

    await expect(guarded()).resolves.toMatchObject({
      serverError: { code: "FORBIDDEN" },
    })
  })

  it("exposes the typed session on ctx.auth for permitted callers", async () => {
    expect.hasAssertions()
    mockSession(createAuthSessionFixture({ role: ROLE_CODES.ADMIN, userId: USER_ID }))

    const guarded = actionClient.use(withAuth({ user: ["list"] })).action(({ ctx }) => Promise.resolve(ctx.auth.user.id))

    await expect(guarded()).resolves.toMatchObject({ data: USER_ID })
  })

  it("requires only a session when no permission is given", async () => {
    expect.hasAssertions()
    mockSession(createAuthSessionFixture({ role: ROLE_CODES.CUSTOMER, userId: USER_ID }))

    const guarded = actionClient.use(withAuth()).action(({ ctx }) => Promise.resolve(ctx.auth.user.id))

    await expect(guarded()).resolves.toMatchObject({ data: USER_ID })
  })
})

describe("with rate limit middleware", () => {
  it("allows requests under the limit and sets the window expiry on the first attempt", async () => {
    expect.hasAssertions()
    redisMocks.incr.mockReset()
    redisMocks.expire.mockReset()
    const FIRST_COUNT = 1
    redisMocks.incr.mockResolvedValue(FIRST_COUNT)
    redisMocks.expire.mockResolvedValue(FIRST_COUNT)

    const limited = actionClient.use(withRateLimit("test-kind", RATE_LIMITS.SENSITIVE)).action(() => Promise.resolve("done"))

    await expect(limited()).resolves.toMatchObject({ data: "done" })
    expect(redisMocks.expire).toHaveBeenCalledWith(expect.stringContaining("action-rate-limit:test-kind:"), RATE_LIMITS.SENSITIVE.window)
  })

  it("rejects requests over the limit with a too-many-requests serverError", async () => {
    expect.hasAssertions()
    redisMocks.incr.mockReset()
    redisMocks.expire.mockReset()
    redisMocks.incr.mockResolvedValue(RATE_LIMITS.SENSITIVE.max + OVER_LIMIT_INCREMENT)

    const limited = actionClient.use(withRateLimit("test-kind", RATE_LIMITS.SENSITIVE)).action(() => Promise.resolve("done"))

    await expect(limited()).resolves.toMatchObject({
      serverError: { code: "TOO_MANY_REQUESTS" },
    })
    expect(redisMocks.expire).not.toHaveBeenCalled()
  })

  it("fails open when the limiter store is unreachable", async () => {
    expect.hasAssertions()
    redisMocks.incr.mockReset()
    redisMocks.expire.mockReset()
    redisMocks.incr.mockRejectedValue(new Error("upstash unreachable"))
    const consoleError = vi.spyOn(console, "error").mockReturnValue()

    const limited = actionClient.use(withRateLimit("test-kind", RATE_LIMITS.SENSITIVE)).action(() => Promise.resolve("done"))

    await expect(limited()).resolves.toMatchObject({ data: "done" })
    expect(consoleError).toHaveBeenCalledWith(expect.stringContaining("test-kind"), expect.any(Error))

    consoleError.mockRestore()
  })
})
