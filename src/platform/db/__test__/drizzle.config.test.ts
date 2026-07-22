import drizzleConfig from "~/src/platform/db/drizzle.config"
import * as schema from "~/src/platform/db/schema"

describe("drizzle kit config", () => {
  it("targets postgres with project schema", () => {
    expect.hasAssertions()
    expect(drizzleConfig.dialect).toBe("postgresql")
    expect(drizzleConfig.schema).toContain("schema.ts")
  })
})

describe("platform db schema barrel", () => {
  it("re-exports schema modules", () => {
    expect.hasAssertions()
    expect(schema.user).toBeDefined()
    expect(schema.account).toBeDefined()
  })
})
