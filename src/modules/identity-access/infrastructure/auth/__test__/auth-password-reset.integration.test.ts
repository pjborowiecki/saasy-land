import {
  AUTH_TEST_BASE_URL,
  createAuthTestInstance,
  createTestUserPayload,
  signUpVerifyAndSignIn,
} from "~/src/modules/identity-access/infrastructure/auth/__test__/auth-test-instance"

const authContext = await createAuthTestInstance()

describe("auth password reset", () => {
  it("sends a reset password email for an existing user", async () => {
    expect.hasAssertions()
    const user = createTestUserPayload()

    await signUpVerifyAndSignIn(authContext, user)

    await authContext.auth.api.requestPasswordReset({
      body: {
        email: user.email,
        redirectTo: `${AUTH_TEST_BASE_URL}/auth/reset-password`,
      },
    })

    expect(authContext.emailCapture.resetPassword.some((entry) => entry.user.email === user.email)).toBe(true)
  })

  it("resets the password with a valid token", async () => {
    expect.hasAssertions()
    const user = createTestUserPayload()
    const newPassword = "NewSecret1!"

    await signUpVerifyAndSignIn(authContext, user)

    await authContext.auth.api.requestPasswordReset({
      body: {
        email: user.email,
        redirectTo: `${AUTH_TEST_BASE_URL}/auth/reset-password`,
      },
    })

    const resetEmail = authContext.emailCapture.resetPassword.find((entry) => entry.user.email === user.email)
    const token = resetEmail?.token

    expect(token).toBeDefined()

    await authContext.auth.api.resetPassword({
      body: {
        newPassword,
        token: token!,
      },
    })

    const { headers } = await authContext.signInWithUser(user.email, newPassword)
    const session = await authContext.auth.api.getSession({ headers })

    expect(session?.user.email).toBe(user.email)
  })

  it("rejects sign-in with the old password after reset", async () => {
    expect.hasAssertions()
    const user = createTestUserPayload()
    const newPassword = "AnotherSecret1!"

    await signUpVerifyAndSignIn(authContext, user)

    await authContext.auth.api.requestPasswordReset({
      body: {
        email: user.email,
        redirectTo: `${AUTH_TEST_BASE_URL}/auth/reset-password`,
      },
    })

    const resetEmail = authContext.emailCapture.resetPassword.find((entry) => entry.user.email === user.email)
    const token = resetEmail?.token

    expect(token).toBeDefined()

    await authContext.auth.api.resetPassword({
      body: {
        newPassword,
        token: token!,
      },
    })

    await expect(
      authContext.auth.api.signInEmail({
        body: { email: user.email, password: user.password },
      }),
    ).rejects.toThrow("Invalid email or password")
  })

  it("rejects password reset with an invalid token", async () => {
    expect.hasAssertions()

    await expect(
      authContext.auth.api.resetPassword({
        body: {
          newPassword: "NewSecret1!",
          token: "invalid-token",
        },
      }),
    ).rejects.toThrow("token")
  })

  it("returns success for password reset requests to unknown emails", async () => {
    expect.hasAssertions()
    const resetCountBefore = authContext.emailCapture.resetPassword.length

    await authContext.auth.api.requestPasswordReset({
      body: {
        email: "missing-user@example.com",
        redirectTo: `${AUTH_TEST_BASE_URL}/auth/reset-password`,
      },
    })

    expect(authContext.emailCapture.resetPassword).toHaveLength(resetCountBefore)
  })
})
