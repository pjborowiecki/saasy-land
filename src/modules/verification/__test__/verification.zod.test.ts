import { describe, expect, it } from "vite-plus/test"

import { verificationZodSchemas } from "~/src/modules/verification/verification.zod"

describe("verification zod schemas", () => {
  it("rejects empty select payloads", () => {
    expect.hasAssertions()
    expect(verificationZodSchemas.select.safeParse({}).success).toBe(false)
  })

  it("accepts valid email on forgot password", () => {
    expect.hasAssertions()
    expect(verificationZodSchemas.forgotPassword.safeParse({ email: "user@example.com" }).success).toBe(true)
  })

  it("rejects invalid email on forgot password", () => {
    expect.hasAssertions()
    expect(verificationZodSchemas.forgotPassword.safeParse({ email: "invalid" }).success).toBe(false)
  })

  it("accepts matching passwords on reset password form", () => {
    expect.hasAssertions()
    expect(
      verificationZodSchemas.resetPasswordForm.safeParse({
        confirmPassword: "Secret1!",
        password: "Secret1!",
      }).success,
    ).toBe(true)
  })

  it("rejects mismatched passwords on reset password form", () => {
    expect.hasAssertions()
    expect(
      verificationZodSchemas.resetPasswordForm.safeParse({
        confirmPassword: "Secret2!",
        password: "Secret1!",
      }).success,
    ).toBe(false)
  })
})
