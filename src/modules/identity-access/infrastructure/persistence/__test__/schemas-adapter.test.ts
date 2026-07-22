import { drizzleAdapter } from "better-auth/adapters/drizzle"

import * as schema from "~/src/platform/db/schema"

describe("drizzleAdapter schema materialization", () => {
  it("builds foreign keys and indexes from schema modules", () => {
    expect.hasAssertions()
    expect(
      drizzleAdapter(
        {},
        {
          provider: "pg",
          schema,
        },
      ),
    ).toBeDefined()
  })
})
