import { ValidationError } from "~/src/modules/shared-kernel/domain/errors/validation.error"
import { Country } from "~/src/modules/shared-kernel/domain/value-objects/country"

describe("country value object", () => {
  it("creates a country from a valid code", () => {
    expect.hasAssertions()
    const country = Country.create("us")
    expect(country.alpha2).toBe("US")
    expect(country.currency).toBe("USD")
    expect(country.messageKey).toBe("countries.US")
  })

  it("rejects unknown country codes", () => {
    expect.hasAssertions()
    expect(() => Country.create("XX")).toThrow(ValidationError)
  })

  it("exposes the default country", () => {
    expect.hasAssertions()
    expect(Country.DEFAULT_CODE).toBe("US")
    expect(Country.default().equals(Country.create("US"))).toBe(true)
  })

  it("stringifies to the alpha-2 code", () => {
    expect.hasAssertions()
    expect(Country.create("PL").toString()).toBe("PL")
    expect(Country.create("US").equals(Country.create("PL"))).toBe(false)
  })
})
