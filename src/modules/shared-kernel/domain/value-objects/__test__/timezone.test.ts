import { ValidationError } from "~/src/modules/shared-kernel/domain/errors/validation.error"
import { Timezone } from "~/src/modules/shared-kernel/domain/value-objects/timezone"

describe("timezone value object", () => {
  it("creates a timezone from a valid IANA code", () => {
    expect.hasAssertions()
    const timezone = Timezone.create("America/New_York")
    expect(timezone.iana).toBe("America/New_York")
    expect(timezone.messageKey).toBe("timezones.America/New_York")
  })

  it("rejects unknown timezone codes", () => {
    expect.hasAssertions()
    expect(() => Timezone.create("Mars/Olympus")).toThrow(ValidationError)
  })

  it("exposes the default timezone", () => {
    expect.hasAssertions()
    expect(Timezone.DEFAULT_CODE).toBe("UTC")
    expect(Timezone.default().equals(Timezone.create("UTC"))).toBe(true)
  })

  it("stringifies to the IANA code", () => {
    expect.hasAssertions()
    expect(Timezone.create("UTC").toString()).toBe("UTC")
    expect(Timezone.create("UTC").equals(Timezone.create("America/New_York"))).toBe(false)
  })
})
