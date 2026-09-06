import { describe, expect, it } from "vite-plus/test"

import { accountZodSchemas } from "~/src/modules/account/account.zod"

describe("account zod schemas", () => {
  it("rejects empty select payloads", () => {
    expect.hasAssertions()
    expect(accountZodSchemas.select.safeParse({}).success).toBe(false)
  })

  it("accepts matching passwords on change password form", () => {
    expect.hasAssertions()
    expect(
      accountZodSchemas.changePasswordForm.safeParse({
        confirmNewPassword: "Secret1!",
        currentPassword: "OldSecret1!",
        newPassword: "Secret1!",
      }).success,
    ).toBe(true)
  })

  it("rejects mismatched new passwords on change password form", () => {
    expect.hasAssertions()
    expect(
      accountZodSchemas.changePasswordForm.safeParse({
        confirmNewPassword: "Secret2!",
        currentPassword: "OldSecret1!",
        newPassword: "Secret1!",
      }).success,
    ).toBe(false)
  })
})
