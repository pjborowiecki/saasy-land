import { PASSWORD_MIN_LENGTH, getPasswordRuleState } from "~/src/integrations/better-auth/auth.constraints"

describe("get password rule state", () => {
  it("matches strictPasswordSchema rules", () => {
    expect.hasAssertions()

    expect(getPasswordRuleState("")).toStrictEqual({
      hasSpecialChar: false,
      hasUppercase: false,
      isMinLength: false,
    })

    const minLengthPassword = "a".repeat(PASSWORD_MIN_LENGTH)
    expect(getPasswordRuleState(minLengthPassword)).toStrictEqual({
      hasSpecialChar: false,
      hasUppercase: false,
      isMinLength: true,
    })

    expect(getPasswordRuleState("Secret1!")).toStrictEqual({
      hasSpecialChar: true,
      hasUppercase: true,
      isMinLength: true,
    })
  })
})
