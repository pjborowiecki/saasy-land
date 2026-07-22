import {
  createOtpSlotIndices,
  extractTotpSecret,
  parseTwoFactorEnableData,
} from "~/src/modules/identity-access/infrastructure/auth/auth.two-factor"

const OTP_SLOT_COUNT = 6
const INVALID_NUMERIC_BACKUP_CODE = 1

describe("parse two factor enable data", () => {
  it("returns undefined for non-object payloads", () => {
    expect.hasAssertions()

    // oxlint-disable-next-line unicorn/no-null -- production code explicitly guards null
    expect(parseTwoFactorEnableData(null)).toBeUndefined()
    expect(parseTwoFactorEnableData("invalid")).toBeUndefined()
    expect(parseTwoFactorEnableData({})).toBeUndefined()
  })

  it("returns undefined when required fields are missing or invalid", () => {
    expect.hasAssertions()

    expect(parseTwoFactorEnableData({ backupCodes: ["code"] })).toBeUndefined()
    expect(parseTwoFactorEnableData({ totpURI: "uri" })).toBeUndefined()
    expect(parseTwoFactorEnableData({ backupCodes: "codes", totpURI: "uri" })).toBeUndefined()
    expect(parseTwoFactorEnableData({ backupCodes: [INVALID_NUMERIC_BACKUP_CODE], totpURI: "uri" })).toBeUndefined()
  })

  it("returns parsed data for valid payloads", () => {
    expect.hasAssertions()

    const payload = {
      backupCodes: ["backup-one", "backup-two"],
      totpURI: "otpauth://totp/App?secret=ABC123",
    }

    expect(parseTwoFactorEnableData(payload)).toStrictEqual(payload)
  })
})

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
