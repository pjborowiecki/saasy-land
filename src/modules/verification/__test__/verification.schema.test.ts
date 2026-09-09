import { drizzleAdapter } from "better-auth/adapters/drizzle"
import { describe, expect, it } from "vite-plus/test"

import { verification } from "~/src/modules/verification/verification.schema"

describe("verification schema", () => {
  it("materializes through drizzle adapter", () => {
    expect.hasAssertions()
    expect(
      drizzleAdapter(
        {},
        {
          provider: "sqlite",
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
