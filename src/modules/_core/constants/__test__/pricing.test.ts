import { describe, expect, it } from "vite-plus/test"

import { applyPpp, getPppMultiplier, getPppPercentOff, pppMultiplierKey } from "~/src/modules/_core/constants/pricing"

describe("regional pricing", () => {
  it.each([
    { country: "PT", multiplier: 0.8, percentOff: 20, price: 239 },
    { country: "pl", multiplier: 0.7, percentOff: 30, price: 209 },
    { country: "IN", multiplier: 0.6, percentOff: 40, price: 179 },
    { country: "UA", multiplier: 0.5, percentOff: 50, price: 149 },
  ])("formats the $299 price for $country consistently with its discount tier", ({ country, multiplier, percentOff, price }) => {
    expect(getPppMultiplier(country)).toBe(multiplier)
    expect(getPppPercentOff(country)).toBe(percentOff)
    expect(pppMultiplierKey(country)).toBe(100 - percentOff)
    expect(applyPpp({ amount: 299, multiplier })).toBe(price)
  })

  it.each([undefined, "US", "XX"])("preserves the original price for a full-price or unavailable country: %j", (country) => {
    const multiplier = getPppMultiplier(country)

    expect(multiplier).toBe(1)
    expect(getPppPercentOff(country)).toBe(0)
    expect(pppMultiplierKey(country)).toBe(100)
    expect(applyPpp({ amount: 295, multiplier })).toBe(295)
  })
})
