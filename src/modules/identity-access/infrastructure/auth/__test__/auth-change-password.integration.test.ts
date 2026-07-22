import {
  createAuthTestInstance,
  createTestUserPayload,
  signUpVerifyAndSignIn,
} from "~/src/modules/identity-access/infrastructure/auth/__test__/auth-test-instance"

const authContext = await createAuthTestInstance()
const UPDATED_PASSWORD = "UpdatedSecret1!"

describe("auth change password", () => {
  it("changes the password for an authenticated credential user", async () => {
    expect.hasAssertions()
    const user = createTestUserPayload()
    const { headers } = await signUpVerifyAndSignIn(authContext, user)

    await authContext.auth.api.changePassword({
      body: {
        currentPassword: user.password,
        newPassword: UPDATED_PASSWORD,
        revokeOtherSessions: false,
      },
      headers,
    })

    const { headers: newHeaders } = await authContext.signInWithUser(user.email, UPDATED_PASSWORD)
    const session = await authContext.auth.api.getSession({ headers: newHeaders })

    expect(session?.user.email).toBe(user.email)
  })

  it("rejects change-password when the current password is wrong", async () => {
    expect.hasAssertions()
    const user = createTestUserPayload()
    const { headers } = await signUpVerifyAndSignIn(authContext, user)

    await expect(
      authContext.auth.api.changePassword({
        body: {
          currentPassword: "WrongPass1!",
          newPassword: UPDATED_PASSWORD,
          revokeOtherSessions: false,
        },
        headers,
      }),
    ).rejects.toThrow("Invalid password")
  })

  it("requires an authenticated session", async () => {
    expect.hasAssertions()

    await expect(
      authContext.auth.api.changePassword({
        body: {
          currentPassword: "Secret1!",
          newPassword: UPDATED_PASSWORD,
          revokeOtherSessions: false,
        },
        headers: new Headers(),
      }),
    ).rejects.toThrow("Unauthorized")
  })
})
