import { describe, expect, it } from "vite-plus/test"

import {
  AUTH_TEST_BASE_URL,
  STRONG_TEST_PASSWORD,
  createAuthTestInstance,
  createTestUserPayload,
  extractQueryParam,
  readSignUpRole,
} from "~/src/integrations/better-auth/__test__/fixtures/auth.test-instance"
import { DEFAULT_ROLE_CODE } from "~/src/integrations/better-auth/auth.access"

const authContext = await createAuthTestInstance()

describe("auth email and password credentials", () => {
  it("signs up a new user with the default customer role", async () => {
    expect.hasAssertions()
    const user = createTestUserPayload()

    const result = await authContext.auth.api.signUpEmail({ body: user })

    expect(result.user.email).toBe(user.email)
    expect(readSignUpRole(result.user)).toBe(DEFAULT_ROLE_CODE)
    expect(authContext.emailCapture.verification.some((entry) => entry.user.email === user.email)).toBe(true)
  })

  it("returns a generic user identity for duplicate sign-up when verification is required", async () => {
    expect.hasAssertions()
    const user = createTestUserPayload()

    const first = await authContext.auth.api.signUpEmail({ body: user })
    const duplicate = await authContext.auth.api.signUpEmail({ body: user })

    expect(duplicate.user.email).toBe(user.email)
    expect(duplicate.user.id).not.toBe(first.user.id)
    expect(duplicate.token).toBeNull()
  })

  it("signs in with valid credentials after email verification", async () => {
    expect.hasAssertions()
    const user = createTestUserPayload()

    await authContext.auth.api.signUpEmail({ body: user })
    const verification = authContext.emailCapture.verification.find((entry) => entry.user.email === user.email)

    expect(verification).toBeDefined()

    const token = extractQueryParam(verification!.url, "token")

    expect(token).toBeDefined()

    await authContext.auth.api.verifyEmail({
      query: { token: token! },
    })

    const { headers } = await authContext.signInWithUser(user.email, user.password)
    const session = await authContext.auth.api.getSession({ headers })

    expect(session?.user.email).toBe(user.email)
  })

  it("rejects sign-in with an invalid password", async () => {
    expect.hasAssertions()
    const user = createTestUserPayload()

    await authContext.auth.api.signUpEmail({ body: user })
    const verification = authContext.emailCapture.verification.find((entry) => entry.user.email === user.email)

    expect(verification).toBeDefined()

    const token = extractQueryParam(verification!.url, "token")

    expect(token).toBeDefined()

    await authContext.auth.api.verifyEmail({
      query: { token: token! },
    })

    await expect(
      authContext.auth.api.signInEmail({
        body: { email: user.email, password: "WrongPass1!" },
      }),
    ).rejects.toThrow("Invalid email or password")
  })

  it("signs out and clears the active session", async () => {
    expect.hasAssertions()
    const user = createTestUserPayload()

    await authContext.auth.api.signUpEmail({ body: user })
    const verification = authContext.emailCapture.verification.find((entry) => entry.user.email === user.email)

    expect(verification).toBeDefined()

    const token = extractQueryParam(verification!.url, "token")

    expect(token).toBeDefined()

    await authContext.auth.api.verifyEmail({
      query: { token: token! },
    })

    const { headers } = await authContext.signInWithUser(user.email, user.password)

    await authContext.auth.api.signOut({ headers })

    const session = await authContext.auth.api.getSession({ headers })
    expect(session).toBeNull()
  })

  it("blocks sign-in when email verification is required but not completed", async () => {
    expect.hasAssertions()
    const user = createTestUserPayload({ password: STRONG_TEST_PASSWORD })

    await authContext.auth.api.signUpEmail({ body: user })

    await expect(
      authContext.auth.api.signInEmail({
        body: { email: user.email, password: user.password },
      }),
    ).rejects.toThrow("Email not verified")
  })
})

describe("auth social providers", () => {
  it("starts github oauth with a provider redirect url", async () => {
    expect.hasAssertions()

    const response = await authContext.auth.api.signInSocial({
      body: {
        callbackURL: `${AUTH_TEST_BASE_URL}/auth/callback`,
        provider: "github",
      },
    })

    expect(response.url).toContain("github.com")
  })

  it("starts google oauth with a provider redirect url", async () => {
    expect.hasAssertions()

    const response = await authContext.auth.api.signInSocial({
      body: {
        callbackURL: `${AUTH_TEST_BASE_URL}/auth/callback`,
        provider: "google",
      },
    })

    expect(response.url).toContain("google")
  })
})
