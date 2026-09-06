import { drizzleAdapter } from "better-auth/adapters/drizzle"
import { getTableConfig } from "drizzle-orm/sqlite-core"
import { describe, expect, it } from "vite-plus/test"

import { twoFactor, twoFactorRelations } from "~/src/modules/two-factor/two-factor.schema"
import { user } from "~/src/modules/user/user.schema"

describe("two-factor schema", () => {
  it("materializes through drizzle adapter", () => {
    expect.hasAssertions()
    expect(
      drizzleAdapter(
        {},
        {
          provider: "pg",
          schema: { twoFactor },
        },
      ),
    ).toBeDefined()
  })

  it("defines relations and foreign keys", () => {
    expect.hasAssertions()
    const onUpdate = twoFactor.updatedAt.onUpdateFn
    expect(onUpdate).toBeDefined()
    expect(onUpdate?.()).toBeInstanceOf(Date)
    expect(getTableConfig(twoFactor).foreignKeys[0]?.reference().foreignColumns[0]).toBe(user.id)
    expect(twoFactorRelations).toBeDefined()
  })
})
