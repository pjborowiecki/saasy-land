import { DEFAULT_TIMEZONE_CODE, TIMEZONE_CODES, TIMEZONES } from "~/src/modules/_core/constants/timezone"

describe("timezone catalog", () => {
  it("derives one code per catalog entry, with no duplicates", () => {
    expect.hasAssertions()
    expect(TIMEZONE_CODES).toHaveLength(TIMEZONES.length)
    expect(new Set(TIMEZONE_CODES).size).toBe(TIMEZONE_CODES.length)
  })

  it("contains the default timezone", () => {
    expect.hasAssertions()
    expect(TIMEZONE_CODES).toContain(DEFAULT_TIMEZONE_CODE)
    expect(DEFAULT_TIMEZONE_CODE).toBe("UTC")
  })

  it("keeps IANA area/location formatting for every zone except UTC", () => {
    expect.hasAssertions()
    for (const code of TIMEZONE_CODES.filter((value) => value !== "UTC")) {
      expect(code).toMatch(/^[A-Za-z]+\/[A-Za-z0-9_+-]+(?:\/[A-Za-z0-9_+-]+)?$/u)
    }
  })
})
