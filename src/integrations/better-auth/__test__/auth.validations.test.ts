import { AUTH_VALIDATIONS } from "~/src/integrations/better-auth/auth.validations"

describe("auth validation constants", () => {
  it("exports validation message keys", () => {
    expect.hasAssertions()
    expect(AUTH_VALIDATIONS.EMAIL_REQUIRED).toBe("emailRequired")
    expect(AUTH_VALIDATIONS.PASSWORDS_MUST_MATCH).toBe("passwordsMustMatch")
  })
})
