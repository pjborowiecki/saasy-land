import {
  createAuthTestInstance,
  createTestUserPayload,
  getExtendedAuthApi,
  requireSessionUserId,
  signUpVerifyAndSignIn,
} from "~/tests/helpers/auth-test-instance"

const authContext = await createAuthTestInstance()
const authApi = getExtendedAuthApi(authContext)

const SINGLE_SESSION_COUNT = 1
const MULTIPLE_SESSIONS_THRESHOLD = 1

describe("auth anonymous users", () => {
  it("creates an anonymous session", async () => {
    expect.hasAssertions()

    const result = await authApi.signInAnonymous()

    expect(result.user["isAnonymous"]).toBe(true)
    expect(result.token).toBeDefined()
  })
})

describe("auth multi-session", () => {
  it("lists active sessions for a signed-in user", async () => {
    expect.hasAssertions()
    const user = createTestUserPayload()
    const { headers } = await signUpVerifyAndSignIn(authContext, user)

    const sessions = await authContext.auth.api.listSessions({ headers })

    expect(sessions.length).toBeGreaterThan(0)
  })

  it("revokes other sessions while keeping the current one", async () => {
    expect.hasAssertions()
    const user = createTestUserPayload()

    await signUpVerifyAndSignIn(authContext, user)
    const secondSession = await authContext.signInWithUser(user.email, user.password)

    const sessionsBefore = await authContext.auth.api.listSessions({ headers: secondSession.headers })
    expect(sessionsBefore.length).toBeGreaterThan(MULTIPLE_SESSIONS_THRESHOLD)

    await authContext.auth.api.revokeOtherSessions({ headers: secondSession.headers })

    const sessionsAfter = await authContext.auth.api.listSessions({ headers: secondSession.headers })
    expect(sessionsAfter).toHaveLength(SINGLE_SESSION_COUNT)
  })
})

describe("auth two-factor", () => {
  it("generates a totp uri when enabling two-factor for a verified user", async () => {
    expect.hasAssertions()
    const user = createTestUserPayload()
    const { headers } = await signUpVerifyAndSignIn(authContext, user)

    const result = await authContext.client.twoFactor.enable({
      fetchOptions: { headers },
      password: user.password,
    })

    expect(result.data?.totpURI).toContain("otpauth://")
  })
})

describe("auth account linking", () => {
  it("lists linked accounts for a credential user", async () => {
    expect.hasAssertions()
    const user = createTestUserPayload()
    const { headers } = await signUpVerifyAndSignIn(authContext, user)

    const accounts = await authContext.auth.api.listUserAccounts({ headers })

    expect(accounts.some((account) => account.providerId === "credential")).toBe(true)
  })

  it("requires a session before listing linked accounts", async () => {
    expect.hasAssertions()

    await expect(authContext.auth.api.listUserAccounts({ headers: new Headers() })).rejects.toThrow("Unauthorized")
  })
})

describe("auth change email", () => {
  it("captures a change-email confirmation message", async () => {
    expect.hasAssertions()
    const user = createTestUserPayload()
    const newEmail = createTestUserPayload().email
    const { headers } = await signUpVerifyAndSignIn(authContext, user)

    await authContext.auth.api.changeEmail({
      body: { newEmail },
      headers,
    })

    expect(authContext.emailCapture.changeEmail.some((entry) => entry.newEmail === newEmail)).toBe(true)
  })
})

describe("auth bans", () => {
  it("prevents a banned user from signing in", async () => {
    expect.hasAssertions()
    const user = createTestUserPayload()
    const { headers } = await signUpVerifyAndSignIn(authContext, user)
    const userId = await requireSessionUserId(authContext, headers)

    await authContext.db.update({
      model: "user",
      update: { banReason: "test ban", banned: true },
      where: [{ field: "id", value: userId }],
    })

    await expect(
      authContext.auth.api.signInEmail({
        body: { email: user.email, password: user.password },
      }),
    ).rejects.toThrow("banned")
  })
})
