import type * as ResendModule from "resend"

import { resend } from "~/src/integrations/resend/resend.config"

vi.mock(import("server-only"), () => ({}))

vi.mock(import("resend"), async (importOriginal) => {
  const actual = await importOriginal<typeof ResendModule>()

  class MockResend extends actual.Resend {
    constructor() {
      super("test-resend-key")
    }
  }

  return {
    ...actual,
    Resend: MockResend,
  }
})

describe("resend config", () => {
  it("exports a resend client", () => {
    expect.hasAssertions()
    expect(resend).toBeDefined()
    expect(resend.emails).toBeDefined()
    expect("send" in resend.emails).toBe(true)
  })
})
