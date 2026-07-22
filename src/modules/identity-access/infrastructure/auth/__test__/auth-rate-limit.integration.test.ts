import {
  AUTH_TEST_BASE_URL,
  createAuthTestInstance,
  createTestUserPayload,
  extractQueryParam,
} from "~/src/modules/identity-access/infrastructure/auth/__test__/auth-test-instance"

const rateLimitContext = await createAuthTestInstance({
  rateLimitEnabled: true,
  rateLimitMax: 1,
})

const SIGN_IN_URL = `${AUTH_TEST_BASE_URL}/api/auth/sign-in/email`
const FAILED_SIGN_IN_STATUS = 401
const RATE_LIMITED_STATUS = 429

function signInWithWrongPassword(email: string): Promise<Response> {
  return rateLimitContext.auth.handler(
    new Request(SIGN_IN_URL, {
      body: JSON.stringify({ email, password: "WrongPass1!" }),
      headers: { "Content-Type": "application/json" },
      method: "POST",
    }),
  )
}

describe("auth rate limiting", () => {
  it("blocks repeated failed sign-in attempts at the HTTP handler", async () => {
    expect.hasAssertions()
    const user = createTestUserPayload()

    await rateLimitContext.auth.api.signUpEmail({ body: user })

    const verification = rateLimitContext.emailCapture.verification.find((entry) => entry.user.email === user.email)

    expect(verification).toBeDefined()

    const token = extractQueryParam(verification!.url, "token")

    expect(token).toBeDefined()

    await rateLimitContext.auth.api.verifyEmail({
      query: { token: token! },
    })

    const firstAttempt = await signInWithWrongPassword(user.email)
    expect(firstAttempt.status).toBe(FAILED_SIGN_IN_STATUS)

    const blockedAttempt = await signInWithWrongPassword(user.email)
    expect(blockedAttempt.status).toBe(RATE_LIMITED_STATUS)
  })
})
