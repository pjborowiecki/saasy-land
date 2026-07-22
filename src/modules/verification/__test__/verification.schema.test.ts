import { drizzleAdapter } from "better-auth/adapters/drizzle"

import { verification } from "~/src/modules/verification/verification.schema"

describe("verification schema", () => {
  it("materializes through drizzle adapter", () => {
    expect.hasAssertions()
    expect(
      drizzleAdapter(
        {},
        {
          provider: "pg",
          schema: { verification },
        },
      ),
    ).toBeDefined()
  })

  it("defines updatedAt onUpdate", () => {
    expect.hasAssertions()
    const onUpdate = verification.updatedAt.onUpdateFn
    expect(onUpdate).toBeDefined()
    expect(onUpdate?.()).toBeInstanceOf(Date)
  })
})
