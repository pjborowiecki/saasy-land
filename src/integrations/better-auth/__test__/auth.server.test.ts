import type * as BetterAuthModule from "better-auth"

import "~/src/integrations/better-auth/auth.server"
import type { AppRedis } from "~/src/integrations/redis/redis.config"
import type * as RedisConfigModule from "~/src/integrations/redis/redis.config"

type BetterAuthOptions = Parameters<typeof BetterAuthModule.betterAuth>[0]

const INITIAL_INCREMENT_COUNT = 1
const SUBSEQUENT_INCREMENT_COUNT = 2
const RATE_LIMIT_TTL_SECONDS = 60
const SESSION_TTL_SECONDS = 120
const ZERO_TTL = 0
const UUID_PATTERN = /^[0-9a-f-]{36}$/iu

const redisDelMock = vi.hoisted(() => vi.fn<AppRedis["del"]>())
const redisExpireMock = vi.hoisted(() => vi.fn<AppRedis["expire"]>())
const redisGetMock = vi.hoisted(() => vi.fn<AppRedis["get"]>())
const redisGetdelMock = vi.hoisted(() => vi.fn<AppRedis["getdel"]>())
const redisIncrMock = vi.hoisted(() => vi.fn<AppRedis["incr"]>())
const redisSetMock = vi.hoisted(() => vi.fn<AppRedis["set"]>())

const capturedConfig = vi.hoisted(() => ({ value: undefined as BetterAuthOptions | undefined }))

vi.mock(import("server-only"), () => ({}))

vi.mock(
  import("~/src/integrations/redis/redis.config"),
  (): Pick<typeof RedisConfigModule, "redis"> => ({
    redis: {
      del: redisDelMock,
      expire: redisExpireMock,
      get: redisGetMock,
      getdel: redisGetdelMock,
      incr: redisIncrMock,
      set: redisSetMock,
    },
  }),
)

vi.mock(import("better-auth"), async (importOriginal): Promise<Partial<typeof BetterAuthModule>> => {
  const actual = await importOriginal<typeof BetterAuthModule>()
  const betterAuth: typeof actual.betterAuth = (options) => {
    capturedConfig.value = options
    return actual.betterAuth(options)
  }

  return {
    ...actual,
    betterAuth,
  }
})

interface SecondaryStorage {
  delete: (key: string) => Promise<void>
  get: (key: string) => Promise<string | null>
  getAndDelete: (key: string) => Promise<string | null>
  increment: (key: string, ttl?: number) => Promise<number>
  set: (key: string, value: string, ttl?: number) => Promise<void>
}

function isSecondaryStorage(value: unknown): value is SecondaryStorage {
  if (typeof value !== "object" || value === null) {
    return false
  }

  return (
    "delete" in value &&
    typeof value.delete === "function" &&
    "get" in value &&
    typeof value.get === "function" &&
    "getAndDelete" in value &&
    typeof value.getAndDelete === "function" &&
    "increment" in value &&
    typeof value.increment === "function" &&
    "set" in value &&
    typeof value.set === "function"
  )
}

function getSecondaryStorage(): SecondaryStorage {
  const storage = capturedConfig.value?.secondaryStorage

  if (!isSecondaryStorage(storage)) {
    throw new Error("secondaryStorage missing from auth config")
  }

  return storage
}

function isGenerateId(value: unknown): value is () => string {
  return typeof value === "function"
}

function readGenerateId(): (() => string) | undefined {
  const database = capturedConfig.value?.advanced?.database

  if (typeof database !== "object" || database === null || !("generateId" in database)) {
    return undefined
  }

  const { generateId } = database

  return isGenerateId(generateId) ? generateId : undefined
}

function resetRedisMocks(): void {
  redisDelMock.mockReset()
  redisExpireMock.mockReset()
  redisGetMock.mockReset()
  redisGetdelMock.mockReset()
  redisIncrMock.mockReset()
  redisSetMock.mockReset()
}

describe("auth secondaryStorage", () => {
  it("delete removes key from redis", async () => {
    expect.hasAssertions()
    resetRedisMocks()
    await getSecondaryStorage().delete("session:key")
    expect(redisDelMock).toHaveBeenCalledWith("session:key")
  })

  it("get reads from redis", async () => {
    expect.hasAssertions()
    resetRedisMocks()
    redisGetMock.mockResolvedValue("value")
    await expect(getSecondaryStorage().get("session:key")).resolves.toBe("value")
  })

  it("getAndDelete uses redis getdel", async () => {
    expect.hasAssertions()
    resetRedisMocks()
    redisGetdelMock.mockResolvedValue("value")
    await expect(getSecondaryStorage().getAndDelete("session:key")).resolves.toBe("value")
  })

  it("increment sets expiry on first count", async () => {
    expect.hasAssertions()
    resetRedisMocks()
    redisIncrMock.mockResolvedValue(INITIAL_INCREMENT_COUNT)
    await expect(getSecondaryStorage().increment("rate:key", RATE_LIMIT_TTL_SECONDS)).resolves.toBe(INITIAL_INCREMENT_COUNT)
    expect(redisExpireMock).toHaveBeenCalledWith("rate:key", RATE_LIMIT_TTL_SECONDS)
  })

  it("increment skips expiry when ttl is zero", async () => {
    expect.hasAssertions()
    resetRedisMocks()
    redisIncrMock.mockResolvedValue(SUBSEQUENT_INCREMENT_COUNT)
    await expect(getSecondaryStorage().increment("rate:key", ZERO_TTL)).resolves.toBe(SUBSEQUENT_INCREMENT_COUNT)
    expect(redisExpireMock).not.toHaveBeenCalled()
  })

  it("set stores value with ttl", async () => {
    expect.hasAssertions()
    resetRedisMocks()
    await getSecondaryStorage().set("session:key", "value", SESSION_TTL_SECONDS)
    expect(redisSetMock).toHaveBeenCalledWith("session:key", "value", { ex: SESSION_TTL_SECONDS })
  })

  it("set deletes key when ttl is non-positive", async () => {
    expect.hasAssertions()
    resetRedisMocks()
    await getSecondaryStorage().set("session:key", "value", ZERO_TTL)
    expect(redisDelMock).toHaveBeenCalledWith("session:key")
    expect(redisSetMock).not.toHaveBeenCalled()
  })

  it("set no-ops when ttl is omitted", async () => {
    expect.hasAssertions()
    resetRedisMocks()
    await getSecondaryStorage().set("session:key", "value")
    expect(redisDelMock).not.toHaveBeenCalled()
    expect(redisSetMock).not.toHaveBeenCalled()
  })

  it("increment skips expiry when count is not initial", async () => {
    expect.hasAssertions()
    resetRedisMocks()
    redisIncrMock.mockResolvedValue(SUBSEQUENT_INCREMENT_COUNT)
    await expect(getSecondaryStorage().increment("rate:key", RATE_LIMIT_TTL_SECONDS)).resolves.toBe(SUBSEQUENT_INCREMENT_COUNT)
    expect(redisExpireMock).not.toHaveBeenCalled()
  })

  it("generates ids through better-auth advanced config", () => {
    expect.hasAssertions()
    expect(readGenerateId()?.()).toMatch(UUID_PATTERN)
  })
})
