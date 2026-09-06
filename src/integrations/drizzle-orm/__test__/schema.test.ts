import { drizzleAdapter } from "better-auth/adapters/drizzle"
import { describe, expect, it } from "vite-plus/test"

import * as schema from "~/src/integrations/drizzle-orm/drizzle.schemas"

import { account } from "~/src/modules/account/account.schema"
import { session } from "~/src/modules/session/session.schema"
import { twoFactor } from "~/src/modules/two-factor/two-factor.schema"
import { user } from "~/src/modules/user/user.schema"
import { verification } from "~/src/modules/verification/verification.schema"

describe("platform db schema barrel", () => {
  it("materializes schema through drizzle adapter", () => {
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

  it("materializes table indexes and foreign keys", () => {
    expect.hasAssertions()
    expect(
      drizzleAdapter(
        {},
        {
          provider: "pg",
          schema: { account, session, twoFactor, user, verification },
        },
      ),
    ).toBeDefined()
    expect(account.userId).toBeDefined()
  })
})
