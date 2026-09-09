import { drizzleAdapter } from "better-auth/adapters/drizzle"
import { getTableConfig } from "drizzle-orm/sqlite-core"
import { describe, expect, it } from "vite-plus/test"

import { license, licenseRelations, licenseStatusEnum, licenseTierEnum } from "~/src/modules/license/license.schema"
import { licenseZodSchemas } from "~/src/modules/license/license.zod"
import { user } from "~/src/modules/user/user.schema"

describe("license schema", () => {
  it("materializes through drizzle adapter", () => {
    expect.hasAssertions()
    expect(drizzleAdapter({}, { provider: "sqlite", schema: { license } })).toBeDefined()
  })

  it("ties a license to the user who bought it", () => {
    expect.hasAssertions()
    expect(getTableConfig(license).foreignKeys[0]?.reference().foreignColumns[0]).toBe(user.id)
    expect(licenseRelations).toBeDefined()
  })

  it("defines enums and updatedAt onUpdate", () => {
    expect.hasAssertions()
    expect(licenseTierEnum.enumValues).toStrictEqual(["core", "complete", "agency"])
    expect(licenseStatusEnum.enumValues).toStrictEqual(["active", "revoked"])
    const onUpdate = license.updatedAt.onUpdateFn
    expect(onUpdate).toBeDefined()
    expect(onUpdate?.()).toBeInstanceOf(Date)
  })

  it("accepts a tier the checkout can start", () => {
    expect.hasAssertions()
    expect(licenseZodSchemas.startCheckout.safeParse({ tier: "complete" }).success).toBe(true)
    expect(licenseZodSchemas.startCheckout.safeParse({ tier: "enterprise" }).success).toBe(false)
  })
})
