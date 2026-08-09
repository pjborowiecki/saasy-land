import { COUNTRIES, type CountryCode } from "~/src/modules/_core/constants/country"
import { CURRENCIES } from "~/src/modules/_core/constants/currency"

describe("country catalog", () => {
  it("keeps alpha-2 codes unique and uppercase", () => {
    expect.hasAssertions()
    const codes = COUNTRIES.map((country) => country.alpha2)
    expect(new Set(codes).size).toBe(COUNTRIES.length)
    for (const code of codes) {
      expect(code).toMatch(/^[A-Z]{2}$/u)
    }
  })

  it("references only currencies that exist in the currency catalog", () => {
    expect.hasAssertions()
    for (const country of COUNTRIES) {
      expect(CURRENCIES).toHaveProperty(country.currency)
    }
  })

  it("contains the United States with its ISO identifiers", () => {
    expect.hasAssertions()
    const us: CountryCode = "US"
    const entry = COUNTRIES.find((country) => country.alpha2 === us)
    expect(entry).toMatchObject({ alpha3: "USA", currency: "USD", numeric: "840" })
  })
})
