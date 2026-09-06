import { describe, expect, it } from "vite-plus/test"

import drizzleConfig from "~/src/integrations/drizzle-orm/drizzle.config"
import * as schema from "~/src/integrations/drizzle-orm/drizzle.schemas"

describe("drizzle kit config", () => {
  it("targets D1 SQLite over the HTTP driver with the project schema", () => {
    expect.hasAssertions()
    expect(drizzleConfig.dialect).toBe("sqlite")
    expect(drizzleConfig.schema).toContain("drizzle.schemas.ts")
    expect(drizzleConfig).toMatchObject({ driver: "d1-http" })
  })
})

describe("platform db schema barrel", () => {
  it("re-exports schema modules", () => {
    expect.hasAssertions()
    expect(schema.user).toBeDefined()
    expect(schema.account).toBeDefined()
  })
})
