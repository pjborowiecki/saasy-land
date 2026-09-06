import { describe, expect, it } from "vite-plus/test"

import { twoFactorZodSchemas } from "~/src/modules/two-factor/two-factor.zod"

describe("two-factor zod schemas", () => {
  it("rejects empty select payloads", () => {
    expect.hasAssertions()
    expect(twoFactorZodSchemas.select.safeParse({}).success).toBe(false)
  })

  it("accepts a six-digit code on verify totp", () => {
    expect.hasAssertions()
    expect(twoFactorZodSchemas.verifyTotp.safeParse({ code: "123456" }).success).toBe(true)
  })

  it("rejects invalid code lengths on verify totp", () => {
    expect.hasAssertions()
    expect(twoFactorZodSchemas.verifyTotp.safeParse({ code: "12345" }).success).toBe(false)
    expect(twoFactorZodSchemas.verifyTotp.safeParse({ code: "1234567" }).success).toBe(false)
  })

  it("accepts valid backup codes on verify backup code", () => {
    expect.hasAssertions()
    expect(twoFactorZodSchemas.verifyBackupCode.safeParse({ code: "backup12" }).success).toBe(true)
  })

  it("rejects invalid backup code lengths on verify backup code", () => {
    expect.hasAssertions()
    expect(twoFactorZodSchemas.verifyBackupCode.safeParse({ code: "short" }).success).toBe(false)
    expect(twoFactorZodSchemas.verifyBackupCode.safeParse({ code: "toolongbackup" }).success).toBe(false)
  })

  it("accepts a non-empty password on enable two factor", () => {
    expect.hasAssertions()
    expect(twoFactorZodSchemas.enableTwoFactor.safeParse({ password: "Secret1!" }).success).toBe(true)
  })

  it("rejects an empty password on enable two factor", () => {
    expect.hasAssertions()
    expect(twoFactorZodSchemas.enableTwoFactor.safeParse({ password: "" }).success).toBe(false)
  })
})
