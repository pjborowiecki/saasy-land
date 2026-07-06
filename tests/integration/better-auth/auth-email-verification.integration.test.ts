import {
  createAuthTestInstance,
  createTestUserPayload,
  extractQueryParam,
  findAuthTestUser,
  signUpVerifyAndSignIn,
} from "~/tests/helpers/auth-test-instance"

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

  it("rejects invalid verification tokens", async () => {
    expect.hasAssertions()

    await expect(
      authContext.auth.api.verifyEmail({
        query: { token: "invalid-token" },
      }),
    ).rejects.toThrow("token")
  })
})
