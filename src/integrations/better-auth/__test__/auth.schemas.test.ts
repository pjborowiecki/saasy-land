import {
  emailSchema,
  forgotPasswordSchema,
  resetPasswordSchema,
  signInWithPasswordSchema,
  signUpWithPasswordSchema,
} from "~/src/integrations/better-auth/auth.schemas"

const t = (key: string) => key

describe("email schema component", () => {
  it("accepts valid email", () => {
    expect.hasAssertions()
    expect(emailSchema(t).safeParse("user@example.com").success).toBe(true)
  })

  it("rejects invalid email", () => {
    expect.hasAssertions()
    expect(emailSchema(t).safeParse("not-an-email").success).toBe(false)
  })
})

describe("sign up with password schema component", () => {
  it("accepts valid sign-up payload", () => {
    expect.hasAssertions()
    const result = signUpWithPasswordSchema(t).safeParse({
      confirmPassword: "Secret1!",
      email: "user@example.com",
      name: "User",
      password: "Secret1!",
    })
    expect(result.success).toBe(true)
  })

  it("rejects mismatched passwords", () => {
    expect.hasAssertions()
    const result = signUpWithPasswordSchema(t).safeParse({
      confirmPassword: "Secret2!",
      email: "user@example.com",
      name: "User",
      password: "Secret1!",
    })
    expect(result.success).toBe(false)
  })

  it("rejects weak password", () => {
    expect.hasAssertions()
    const result = signUpWithPasswordSchema(t).safeParse({
      confirmPassword: "weak",
      email: "user@example.com",
      name: "User",
      password: "weak",
    })
    expect(result.success).toBe(false)
  })
})

describe("sign in with password schema component", () => {
  it("accepts valid sign-in payload", () => {
    expect.hasAssertions()
    expect(
      signInWithPasswordSchema(t).safeParse({
        email: "user@example.com",
        password: "any-password",
      }).success,
    ).toBe(true)
  })

  it("rejects empty password", () => {
    expect.hasAssertions()
    expect(
      signInWithPasswordSchema(t).safeParse({
        email: "user@example.com",
        password: "",
      }).success,
    ).toBe(false)
  })

  it("rejects invalid email", () => {
    expect.hasAssertions()
    expect(
      signInWithPasswordSchema(t).safeParse({
        email: "not-an-email",
        password: "Secret1!",
      }).success,
    ).toBe(false)
  })
})

describe("forgot password schema component", () => {
  it("accepts valid email", () => {
    expect.hasAssertions()
    expect(forgotPasswordSchema(t).safeParse({ email: "user@example.com" }).success).toBe(true)
  })

  it("rejects invalid email", () => {
    expect.hasAssertions()
    expect(forgotPasswordSchema(t).safeParse({ email: "invalid" }).success).toBe(false)
  })
})

describe("reset password schema component", () => {
  it("accepts matching passwords", () => {
    expect.hasAssertions()
    expect(
      resetPasswordSchema(t).safeParse({
        confirmPassword: "Secret1!",
        password: "Secret1!",
      }).success,
    ).toBe(true)
  })

  it("rejects mismatched passwords", () => {
    expect.hasAssertions()
    expect(
      resetPasswordSchema(t).safeParse({
        confirmPassword: "Secret2!",
        password: "Secret1!",
      }).success,
    ).toBe(false)
  })
})
