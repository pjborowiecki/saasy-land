import { describe, expect, it } from "vite-plus/test"

import { auth } from "~/src/integrations/better-auth/auth.server"

describe("Cloudflare auth configuration", () => {
  it("keeps sessions in D1", () => {
    expect(auth.options.session.storeSessionInDatabase).toBe(true)
  })
  it("uses the database adapter without an external secondary store", () => {
    expect(auth.options.database).toBeTypeOf("function")
    expect(auth.options).not.toHaveProperty("secondaryStorage")
  })
  it("leaves endpoint rate limiting to the edge", () => {
    expect(auth.options).not.toHaveProperty("rateLimit")
  })
  it("preserves verification and session revocation on password reset", () => {
    expect(auth.options.emailAndPassword.requireEmailVerification).toBe(true)
    expect(auth.options.emailAndPassword.revokeSessionsOnPasswordReset).toBe(true)
  })
  it("retains both OAuth providers and encrypted tokens", () => {
    expect(Object.keys(auth.options.socialProviders)).toEqual(["github", "google"])
    expect(auth.options.account.encryptOAuthTokens).toBe(true)
  })
  it("uses Cloudflare's connecting IP for trusted request attribution", () => {
    expect(auth.options.advanced.ipAddress.ipAddressHeaders[0]).toBe("CF-Connecting-IP")
  })
  it("generates UUIDv7 identifiers", () => {
    expect(auth.options.advanced.database.generateId()).toMatch(/^[0-9a-f]{8}-[0-9a-f]{4}-7[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/u)
  })
})
