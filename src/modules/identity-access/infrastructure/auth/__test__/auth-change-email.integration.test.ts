import {
  completeChangeEmailFlow,
  createAuthTestInstance,
  createTestUserPayload,
  findAuthTestUser,
  signUpVerifyAndSignIn,
} from "~/src/modules/identity-access/infrastructure/auth/__test__/auth-test-instance"

const authContext = await createAuthTestInstance()

describe("auth change email", () => {
  it("completes the two-step change-email flow and updates the stored email", async () => {
    expect.hasAssertions()
    const user = createTestUserPayload()
    const newEmail = createTestUserPayload().email
    const { headers } = await signUpVerifyAndSignIn(authContext, user)

    await completeChangeEmailFlow(authContext, headers, newEmail)

    const updated = await findAuthTestUser(authContext, newEmail)

    expect(updated.email).toBe(newEmail)
    expect(updated.emailVerified).toBe(true)
  })

  it("rejects changing to the same email address", async () => {
    expect.hasAssertions()
    const user = createTestUserPayload()
    const { headers } = await signUpVerifyAndSignIn(authContext, user)

    await expect(
      authContext.auth.api.changeEmail({
        body: { newEmail: user.email },
        headers,
      }),
    ).rejects.toThrow("Email")
  })

  it("returns success without leaking whether the target email already exists", async () => {
    expect.hasAssertions()
    const existingUser = createTestUserPayload()
    const attacker = createTestUserPayload()
    const { headers } = await signUpVerifyAndSignIn(authContext, attacker)

    await signUpVerifyAndSignIn(authContext, existingUser)

    const result = await authContext.auth.api.changeEmail({
      body: { newEmail: existingUser.email },
      headers,
    })

    expect(result.status).toBe(true)
    expect(authContext.emailCapture.changeEmail.some((entry) => entry.newEmail === existingUser.email)).toBe(false)
  })
})
