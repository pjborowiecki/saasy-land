import { db } from "~/src/integrations/drizzle-orm/drizzle.database"

vi.mock(import("server-only"), () => ({}))

describe("drizzle database", () => {
  it("initializes drizzle with neon", () => {
    expect.hasAssertions()
    expect(db).toBeDefined()
    expect(db.query).toBeDefined()
  })
})
