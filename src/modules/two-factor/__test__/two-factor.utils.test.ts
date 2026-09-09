import { describe, expect, it } from "vite-plus/test"

import { createOtpSlotIndices, extractTotpSecret } from "~/src/modules/two-factor/two-factor.utils"

const OTP_SLOT_COUNT = 6
describe("extract totp secret", () => {
  it("extracts the secret query parameter from a totp uri", () => {
    expect.hasAssertions()
    expect(extractTotpSecret("otpauth://totp/App?secret=ABC123")).toBe("ABC123")
  })

  it("falls back to the original uri when parsing fails", () => {
    expect.hasAssertions()
    expect(extractTotpSecret("not-a-valid-uri")).toBe("not-a-valid-uri")
    expect(extractTotpSecret("otpauth://totp/App")).toBe("otpauth://totp/App")
  })
})

describe("create otp slot indices", () => {
  it("creates zero-based indices for the requested length", () => {
    expect.hasAssertions()
    const expectedIndices = Array.from({ length: OTP_SLOT_COUNT }, (_, index) => index)

    expect(createOtpSlotIndices(OTP_SLOT_COUNT)).toStrictEqual(expectedIndices)
  })
})
