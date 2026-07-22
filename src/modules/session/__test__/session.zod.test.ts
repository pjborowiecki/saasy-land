import { sessionZodSchemas } from "~/src/modules/session/session.zod"

const USER_ID = "00000000-0000-7000-8000-000000000001"

describe("session zod schemas", () => {
  it("rejects incomplete insert payloads", () => {
    expect.hasAssertions()
    expect(sessionZodSchemas.insert.safeParse({ userId: USER_ID }).success).toBe(false)
  })
})
