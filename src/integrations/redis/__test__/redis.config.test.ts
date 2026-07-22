import { redis } from "~/src/integrations/redis/redis.config"

vi.mock(import("server-only"), () => ({}))

describe("redis client", () => {
  it("exports a configured app redis client", () => {
    expect.hasAssertions()
    expect(redis).toBeDefined()
    expect(redis.get).toBeTypeOf("function")
    expect(redis.set).toBeTypeOf("function")
  })
})
