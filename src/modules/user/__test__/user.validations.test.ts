import { describe, expect, it } from "vite-plus/test"

import { USER_VALIDATION_MESSAGE } from "~/src/modules/user/user.validations"

describe("user validation messages", () => {
  it("stores message keys aligned with user.validations translations", () => {
    expect.hasAssertions()
    expect(USER_VALIDATION_MESSAGE.atLeastOneFieldRequired).toBe("atLeastOneFieldRequired")
  })
})
