import { createAppRedis, createAppRedisFromConstructor, redis, type AppRedis } from "~/src/integrations/redis/redis.config"

const EXPIRE_SECONDS = 60
const FACTORY_EXPIRE_SECONDS = 10
const SET_TTL_SECONDS = 30
const DELETED_COUNT = 1
const INCREMENTED_COUNT = 2
const FACTORY_INCREMENTED_COUNT = 3

vi.mock(import("server-only"), () => ({}))

function createFakeAppRedis(): AppRedis {
  return {
    del: vi.fn<AppRedis["del"]>().mockResolvedValue(DELETED_COUNT),
    expire: vi.fn<AppRedis["expire"]>().mockResolvedValue(DELETED_COUNT),
    get: vi.fn<AppRedis["get"]>().mockResolvedValue("v"),
    getdel: vi.fn<AppRedis["getdel"]>().mockResolvedValue("v"),
    incr: vi.fn<AppRedis["incr"]>().mockResolvedValue(INCREMENTED_COUNT),
    set: vi.fn<AppRedis["set"]>().mockResolvedValue("OK"),
  }
}

describe("redis client", () => {
  it("exports a configured app redis client", () => {
    expect.hasAssertions()
    expect(redis).toBeDefined()
    expect(redis.get).toBeTypeOf("function")
  })
})

describe("app redis from constructor", () => {
  it("constructs a client with the provided credentials", async () => {
    expect.hasAssertions()
    const constructed: { token?: string; url?: string } = {}
    const methods = createFakeAppRedis()

    class FakeRedis implements AppRedis {
      del = methods.del
      expire = methods.expire
      get = methods.get
      getdel = methods.getdel
      incr = methods.incr
      set = methods.set

      constructor(config: { automaticDeserialization: boolean; token: string; url: string }) {
        constructed.token = config.token
        constructed.url = config.url
      }
    }

    const appRedis = createAppRedisFromConstructor(FakeRedis, {
      token: "test-token",
      url: "https://example.upstash.io",
    })

    await expect(appRedis.get("k")).resolves.toBe("v")
    await expect(appRedis.set("k", "v", { ex: SET_TTL_SECONDS })).resolves.toBe("OK")
    expect(constructed).toStrictEqual({
      token: "test-token",
      url: "https://example.upstash.io",
    })
  })
})

describe("app redis factory", () => {
  it("forwards read methods to the underlying client", async () => {
    expect.hasAssertions()
    const client = createFakeAppRedis()
    const appRedis = createAppRedis(client)

    await expect(appRedis.get("a")).resolves.toBe("v")
    await expect(appRedis.getdel("a")).resolves.toBe("v")
    expect(client.get).toHaveBeenCalledWith("a")
    expect(client.getdel).toHaveBeenCalledWith("a")
  })

  it("forwards write methods to the underlying client", async () => {
    expect.hasAssertions()
    const client: AppRedis = {
      del: vi.fn<AppRedis["del"]>().mockResolvedValue(DELETED_COUNT),
      expire: vi.fn<AppRedis["expire"]>().mockResolvedValue(DELETED_COUNT),
      get: vi.fn<AppRedis["get"]>().mockResolvedValue("v"),
      getdel: vi.fn<AppRedis["getdel"]>().mockResolvedValue("v"),
      incr: vi.fn<AppRedis["incr"]>().mockResolvedValue(FACTORY_INCREMENTED_COUNT),
      set: vi.fn<AppRedis["set"]>().mockResolvedValue("OK"),
    }
    const appRedis = createAppRedis(client)

    await expect(appRedis.del("a")).resolves.toBe(DELETED_COUNT)
    await expect(appRedis.expire("a", FACTORY_EXPIRE_SECONDS)).resolves.toBe(DELETED_COUNT)
    await expect(appRedis.incr("a")).resolves.toBe(FACTORY_INCREMENTED_COUNT)
    await expect(appRedis.set("a", "b")).resolves.toBe("OK")
    expect(client.set).toHaveBeenCalledWith("a", "b", undefined)
  })

  it("forwards expire with the configured ttl", async () => {
    expect.hasAssertions()
    const client = createFakeAppRedis()
    const appRedis = createAppRedis(client)

    await expect(appRedis.expire("k", EXPIRE_SECONDS)).resolves.toBe(DELETED_COUNT)
    expect(client.expire).toHaveBeenCalledWith("k", EXPIRE_SECONDS)
  })
})
