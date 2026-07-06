import { env } from "~/src/environment"

const MIN_AUTH_SECRET_LENGTH = 64

describe("environment variables", () => {
  it("loads validated environment variables", () => {
    expect.hasAssertions()
    expect(env.NEXT_PUBLIC_APP_URL).toMatch(/^https?:\/\//u)
    expect(env.AUTH_SECRET.length).toBeGreaterThanOrEqual(MIN_AUTH_SECRET_LENGTH)
    expect(env.RESEND_API_KEY.startsWith("re_")).toBe(true)
  })
})
