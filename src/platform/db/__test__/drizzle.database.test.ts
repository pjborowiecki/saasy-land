import { db } from "~/src/platform/db/client"

vi.mock(import("server-only"), () => ({}))

describe("drizzle database", () => {
  it("initializes drizzle with neon", () => {
    expect.hasAssertions()
    expect(db).toBeDefined()
    expect(db.query).toBeDefined()
  })
})
