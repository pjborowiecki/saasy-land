import drizzleConfig from "~/src/integrations/drizzle-orm/drizzle.config"
import * as schema from "~/src/integrations/drizzle-orm/drizzle.schemas"

describe("drizzle kit config", () => {
  it("targets postgres with project schema", () => {
    expect.hasAssertions()
    expect(drizzleConfig.dialect).toBe("postgresql")
    expect(drizzleConfig.schema).toContain("drizzle.schemas.ts")
  })
})

describe("drizzle.schemas", () => {
  it("re-exports schema modules", () => {
    expect.hasAssertions()
    expect(schema.user).toBeDefined()
    expect(schema.account).toBeDefined()
  })
})
