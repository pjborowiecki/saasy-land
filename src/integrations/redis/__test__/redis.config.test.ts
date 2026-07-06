import { redis } from "~/src/integrations/redis/redis.config"

vi.mock(import("server-only"), () => ({}))

describe("redis client", () => {
  it("creates upstash client with env credentials", () => {
    expect.hasAssertions()
    expect(redis).toBeDefined()
    expect(redis.get).toBeTypeOf("function")
  })
})
