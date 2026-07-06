import { resend } from "~/src/integrations/resend/resend.config"

vi.mock(import("server-only"), () => ({}))

describe("resend client", () => {
  it("creates resend client with api key", () => {
    expect.hasAssertions()
    expect(resend).toBeDefined()
  })
})
