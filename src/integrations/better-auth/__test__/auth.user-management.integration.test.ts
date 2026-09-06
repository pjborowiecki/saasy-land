import { describe, expect, it } from "vite-plus/test"

import {
  createAuthTestInstance,
  createTestUserPayload,
  signUpVerifyAndSignIn,
} from "~/src/integrations/better-auth/__test__/fixtures/auth.test-instance"

const authContext = await createAuthTestInstance()

const MULTIPLE_SESSIONS_THRESHOLD = 1
const LAST_SESSION_INDEX = -1
const SINGLE_SESSION_REVOKE_DELTA = 1

describe("auth update user", () => {
  it("updates the signed-in user name", async () => {
    expect.hasAssertions()
    const user = createTestUserPayload()
    const { headers } = await signUpVerifyAndSignIn(authContext, user)

    await authContext.auth.api.updateUser({
      body: { name: "Updated Name" },
      headers,
    })

    const session = await authContext.auth.api.getSession({ headers })

    expect(session?.user.name).toBe("Updated Name")
  })

  it("rejects direct email updates through update-user", async () => {
    expect.hasAssertions()
    const user = createTestUserPayload()
    const { headers } = await signUpVerifyAndSignIn(authContext, user)

    const invalidBody = { email: createTestUserPayload().email }

    await expect(
      authContext.auth.api.updateUser({
        body: invalidBody,
        headers,
      }),
    ).rejects.toThrow("Email can not be updated")
  })
})

describe("auth send verification email", () => {
  it("resends verification for an unverified user without a session", async () => {
    expect.hasAssertions()
    const user = createTestUserPayload()

    await authContext.auth.api.signUpEmail({ body: user })

    const verificationCountBefore = authContext.emailCapture.verification.length

    await authContext.auth.api.sendVerificationEmail({
      body: { email: user.email },
    })

    expect(authContext.emailCapture.verification.length).toBeGreaterThan(verificationCountBefore)
  })

  it("rejects resend when the signed-in email is already verified", async () => {
    expect.hasAssertions()
    const user = createTestUserPayload()
    const { headers } = await signUpVerifyAndSignIn(authContext, user)

    await expect(
      authContext.auth.api.sendVerificationEmail({
        body: { email: user.email },
        headers,
      }),
    ).rejects.toThrow("verified")
  })
})

describe("auth revoke session", () => {
  it("revokes another active session while keeping the current one", async () => {
    expect.hasAssertions()
    const user = createTestUserPayload()

    await signUpVerifyAndSignIn(authContext, user)
    const secondSession = await authContext.signInWithUser(user.email, user.password)

    const sessionsBefore = await authContext.auth.api.listSessions({ headers: secondSession.headers })
    expect(sessionsBefore.length).toBeGreaterThan(MULTIPLE_SESSIONS_THRESHOLD)

    const currentSession = sessionsBefore.at(LAST_SESSION_INDEX)

    expect(currentSession).toBeDefined()

    const otherSession = sessionsBefore.find((session) => session.id !== currentSession!.id)

    expect(otherSession).toBeDefined()

    await authContext.auth.api.revokeSession({
      body: { token: otherSession!.token },
      headers: secondSession.headers,
    })

    const sessionsAfter = await authContext.auth.api.listSessions({ headers: secondSession.headers })

    expect(sessionsAfter).toHaveLength(sessionsBefore.length - SINGLE_SESSION_REVOKE_DELTA)
  })
})
