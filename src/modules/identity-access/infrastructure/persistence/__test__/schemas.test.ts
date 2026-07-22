import { drizzleAdapter } from "better-auth/adapters/drizzle"
import { getTableConfig } from "drizzle-orm/pg-core"

import * as schema from "~/src/platform/db/schema"

import { account, accountRelations } from "~/src/modules/identity-access/infrastructure/persistence/schema/account.table"
import { accountZodSchemas } from "~/src/modules/identity-access/infrastructure/persistence/schema/account.zod"
import { session, sessionRelations } from "~/src/modules/identity-access/infrastructure/persistence/schema/session.table"
import { sessionZodSchemas } from "~/src/modules/identity-access/infrastructure/persistence/schema/session.zod"
import { twoFactor, twoFactorRelations } from "~/src/modules/identity-access/infrastructure/persistence/schema/two-factor.table"
import { user, userRelations } from "~/src/modules/identity-access/infrastructure/persistence/schema/user.table"
import { userZodSchemas } from "~/src/modules/identity-access/infrastructure/persistence/schema/user.zod"
import { verification } from "~/src/modules/identity-access/infrastructure/persistence/schema/verification.table"
import { verificationZodSchemas } from "~/src/modules/identity-access/infrastructure/persistence/schema/verification.zod"

const USER_ID = "00000000-0000-7000-8000-000000000001"

describe("drizzle modules", () => {
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

  it("defines account schema and relations", () => {
    expect.hasAssertions()
    const onUpdate = account.updatedAt.onUpdateFn
    expect(onUpdate).toBeDefined()
    expect(onUpdate?.()).toBeInstanceOf(Date)
    expect(getTableConfig(account).foreignKeys[0]?.reference().foreignColumns[0]).toBe(user.id)
    expect(accountRelations).toBeDefined()
    expect(accountZodSchemas.select.safeParse({}).success).toBe(false)
  })

  it("defines session schema and relations", () => {
    expect.hasAssertions()
    const onUpdate = session.updatedAt.onUpdateFn
    expect(onUpdate).toBeDefined()
    expect(onUpdate?.()).toBeInstanceOf(Date)
    expect(getTableConfig(session).foreignKeys[0]?.reference().foreignColumns[0]).toBe(user.id)
    expect(sessionRelations).toBeDefined()
    expect(sessionZodSchemas.insert.safeParse({ userId: USER_ID }).success).toBe(false)
  })

  it("defines user schema and relations", () => {
    expect.hasAssertions()
    const onUpdate = user.updatedAt.onUpdateFn
    expect(onUpdate).toBeDefined()
    expect(onUpdate?.()).toBeInstanceOf(Date)
    expect(userRelations).toBeDefined()
    expect(
      userZodSchemas.insert.safeParse({
        email: "user@example.com",
        id: USER_ID,
        name: "User",
      }).success,
    ).toBe(true)
  })

  it("defines verification schema", () => {
    expect.hasAssertions()
    const onUpdate = verification.updatedAt.onUpdateFn
    expect(onUpdate).toBeDefined()
    expect(onUpdate?.()).toBeInstanceOf(Date)
    expect(verificationZodSchemas.select.safeParse({}).success).toBe(false)
  })

  it("defines two-factor schema and relations", () => {
    expect.hasAssertions()
    const onUpdate = twoFactor.updatedAt.onUpdateFn
    expect(onUpdate).toBeDefined()
    expect(onUpdate?.()).toBeInstanceOf(Date)
    expect(getTableConfig(twoFactor).foreignKeys[0]?.reference().foreignColumns[0]).toBe(user.id)
    expect(twoFactorRelations).toBeDefined()
  })
})
