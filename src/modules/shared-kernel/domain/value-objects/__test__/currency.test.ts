import { ValidationError } from "~/src/modules/shared-kernel/domain/errors/validation.error"
import { Currency } from "~/src/modules/shared-kernel/domain/value-objects/currency"

describe("currency value object", () => {
  it("creates a currency from a valid code", () => {
    expect.hasAssertions()
    const currency = Currency.create("usd")
    expect(currency.code).toBe("USD")
    expect(currency.numeric).toBe("840")
    expect(currency.messageKey).toBe("currencies.USD")
  })

  it("rejects unknown currency codes", () => {
    expect.hasAssertions()
    expect(() => Currency.create("ZZZ")).toThrow(ValidationError)
  })

  it("exposes the default currency", () => {
    expect.hasAssertions()
    expect(Currency.DEFAULT_CODE).toBe("USD")
    expect(Currency.default().equals(Currency.create("USD"))).toBe(true)
  })

  it("stringifies to the currency code", () => {
    expect.hasAssertions()
    expect(Currency.create("EUR").toString()).toBe("EUR")
    expect(Currency.create("USD").equals(Currency.create("EUR"))).toBe(false)
  })
})
