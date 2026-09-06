import { describe, expect, it, vi } from "vite-plus/test"

import { db } from "~/src/integrations/drizzle-orm/drizzle.database"

vi.mock(import("@tanstack/react-start/server-only"), () => ({}))

describe("drizzle database", () => {
  it("initializes drizzle with neon", () => {
    expect.hasAssertions()
    expect(db).toBeDefined()
    expect(db.query).toBeDefined()
  })
})
