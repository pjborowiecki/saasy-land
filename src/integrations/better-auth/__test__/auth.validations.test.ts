import { describe, expect, it } from "vite-plus/test"

import { PASSWORD_MIN_LENGTH } from "~/src/integrations/better-auth/auth.constraints"
import { AUTH_VALIDATION_MESSAGE, AUTH_VALIDATION_PARAMS } from "~/src/integrations/better-auth/auth.validations"

describe("auth validation messages", () => {
  it("stores message keys aligned with auth.validations translations", () => {
    expect.hasAssertions()
    expect(AUTH_VALIDATION_MESSAGE.emailRequired).toBe("emailRequired")
    expect(AUTH_VALIDATION_MESSAGE.passwordsMustMatch).toBe("passwordsMustMatch")
  })

  it("provides interpolation params for length-based messages", () => {
    expect.hasAssertions()
    expect(AUTH_VALIDATION_PARAMS.passwordMinLength).toStrictEqual({ min: PASSWORD_MIN_LENGTH })
    expect(AUTH_VALIDATION_PARAMS.emailMaxLength.max).toBeGreaterThan(0)
  })
})
