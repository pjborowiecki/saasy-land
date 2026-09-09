import { describe, expect, it } from "vite-plus/test"

import {
  AUTH_TEST_BASE_URL,
  createAuthTestInstance,
  createTestUserPayload,
  extractQueryParam,
  findAuthTestUser,
  signUpVerifyAndSignIn,
} from "~/src/integrations/better-auth/__test__/fixtures/auth.test-instance"

const authContext = await createAuthTestInstance()

describe("auth email verification", () => {
  it("captures a verification email on sign-up", async () => {
    expect.hasAssertions()
    const user = createTestUserPayload()

    await authContext.auth.api.signUpEmail({ body: user })

    const verification = authContext.emailCapture.verification.find((entry) => entry.user.email === user.email)

    expect(verification?.token).toBeDefined()
    expect(verification?.url).toContain("verify-email")
  })

  it("verifies email and auto signs the user in", async () => {
    expect.hasAssertions()
    const user = createTestUserPayload()

    await authContext.auth.api.signUpEmail({ body: user })
    const verification = authContext.emailCapture.verification.find((entry) => entry.user.email === user.email)

    expect(verification).toBeDefined()

    const token = extractQueryParam(verification!.url, "token")

    expect(token).toBeDefined()

    const result = await authContext.auth.api.verifyEmail({
      query: { token: token! },
    })

    expect(result).toStrictEqual(expect.objectContaining({ status: true }))

    const storedUser = await findAuthTestUser(authContext, user.email)

    expect(storedUser.emailVerified).toBe(true)
  })

  it("allows a verified user to create a session", async () => {
    expect.hasAssertions()
    const { headers, user } = await signUpVerifyAndSignIn(authContext)
    const session = await authContext.auth.api.getSession({ headers })

    expect(session?.user.email).toBe(user.email)
    expect(session?.user.emailVerified).toBe(true)
  })

  it("sets a usable session cookie before redirecting the verification link to its localized callback", async () => {
    const user = createTestUserPayload()
    await authContext.auth.api.signUpEmail({ body: user })
    const verification = authContext.emailCapture.verification.find((entry) => entry.user.email === user.email)
    expect(verification).toBeDefined()

    const callbackURL = `${AUTH_TEST_BASE_URL}/pl-PL/auth/verify-email?verified=true`
    const url = new URL(verification!.url)
    url.searchParams.set("callbackURL", callbackURL)
    const response = await authContext.auth.handler(new Request(url))

    expect(response.status).toBe(302)
    expect(response.headers.get("location")).toBe(callbackURL)
    const cookies = response.headers.getSetCookie()
    expect(cookies.join("; ")).toContain("HttpOnly")
    const cookie = cookies.map((value) => value.split(";")[0]).join("; ")
    const session = await authContext.auth.api.getSession({ headers: new Headers({ cookie }) })
    expect(session?.user).toMatchObject({ email: user.email, emailVerified: true })
  })

  it("does not create another session when a signed-out user reopens an already-used verification link", async () => {
    const user = createTestUserPayload()
    await authContext.auth.api.signUpEmail({ body: user })
    const verification = authContext.emailCapture.verification.find((entry) => entry.user.email === user.email)
    expect(verification).toBeDefined()

    const url = new URL(verification!.url)
    const callbackURL = `${AUTH_TEST_BASE_URL}/auth/verify-email?verified=true`
    url.searchParams.set("callbackURL", callbackURL)
    await authContext.auth.handler(new Request(url))

    const response = await authContext.auth.handler(new Request(url))
    expect(response.status).toBe(302)
    expect(response.headers.get("location")).toBe(callbackURL)
    expect(response.headers.getSetCookie()).toEqual([])
  })

  it("redirects an invalid token to the localized error page without setting a session cookie", async () => {
    const callbackURL = `${AUTH_TEST_BASE_URL}/pl-PL/auth/verify-email?verified=true`
    const url = new URL("/api/auth/verify-email", AUTH_TEST_BASE_URL)
    url.searchParams.set("token", "invalid-token")
    url.searchParams.set("callbackURL", callbackURL)

    const response = await authContext.auth.handler(new Request(url))

    expect(response.status).toBe(302)
    expect(response.headers.get("location")).toBe(`${callbackURL}&error=INVALID_TOKEN`)
    expect(response.headers.getSetCookie()).toEqual([])
  })

  it("rejects invalid verification tokens", async () => {
    expect.hasAssertions()

    await expect(
      authContext.auth.api.verifyEmail({
        query: { token: "invalid-token" },
      }),
    ).rejects.toThrow("token")
  })
})
