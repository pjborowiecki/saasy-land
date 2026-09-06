import { describe, expect, it } from "vite-plus/test"

import { AUTH_ERRORS, type AuthErrorCode, authErrorKey } from "~/src/integrations/better-auth/auth.errors"

const isAuthErrorCode = (code: string): code is AuthErrorCode => Object.hasOwn(AUTH_ERRORS, code)

describe("auth error key component", () => {
  it("maps known auth error codes", () => {
    expect.hasAssertions()
    expect(authErrorKey({ code: "USER_NOT_FOUND" })).toBe(AUTH_ERRORS.USER_NOT_FOUND)
    expect(authErrorKey({ code: "EMAIL_NOT_VERIFIED" })).toBe(AUTH_ERRORS.EMAIL_NOT_VERIFIED)
    expect(authErrorKey({ code: "INVALID_EMAIL_OR_PASSWORD" })).toBe(AUTH_ERRORS.INVALID_EMAIL_OR_PASSWORD)
    expect(authErrorKey({ code: "SOCIAL_ACCOUNT_ALREADY_LINKED" })).toBe(AUTH_ERRORS.SOCIAL_ACCOUNT_ALREADY_LINKED)
    expect(authErrorKey({ code: "SESSION_EXPIRED" })).toBe(AUTH_ERRORS.SESSION_EXPIRED)
  })

  it("maps every declared auth error code", () => {
    expect.hasAssertions()

    for (const code of Object.keys(AUTH_ERRORS).filter((value): value is AuthErrorCode => isAuthErrorCode(value))) {
      expect(authErrorKey({ code })).toBe(AUTH_ERRORS[code])
    }
  })

  it("maps codes carried on an api error body", () => {
    expect.hasAssertions()
    expect(authErrorKey({ body: { code: "INVALID_PASSWORD" } })).toBe(AUTH_ERRORS.INVALID_PASSWORD)
    expect(authErrorKey({ body: { code: "USER_ALREADY_EXISTS" } })).toBe(AUTH_ERRORS.USER_ALREADY_EXISTS)
    expect(authErrorKey({ body: {} })).toBe(AUTH_ERRORS.UNKNOWN_ERROR)
    expect(authErrorKey({ body: { code: 500 } })).toBe(AUTH_ERRORS.UNKNOWN_ERROR)
  })

  it("returns unknown for missing code", () => {
    expect.hasAssertions()
    expect(authErrorKey("invalid")).toBe(AUTH_ERRORS.UNKNOWN_ERROR)
    expect(authErrorKey({})).toBe(AUTH_ERRORS.UNKNOWN_ERROR)
    expect(authErrorKey({ code: 404 })).toBe(AUTH_ERRORS.UNKNOWN_ERROR)
    expect(authErrorKey({ code: "NOT_A_REAL_CODE" })).toBe(AUTH_ERRORS.UNKNOWN_ERROR)
  })
})
