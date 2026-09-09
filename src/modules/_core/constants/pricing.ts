import type { CountryCode } from "~/src/modules/_core/constants/country"

export const FULL_PRICE_MULTIPLIER = 1

export const PPP_PERCENT = 100

const PPP_TIERS = [
  { countries: ["CY", "EE", "GR", "KR", "LT", "LV", "PT", "TW"], multiplier: 0.8 },
  { countries: ["BG", "BR", "CL", "CZ", "HU", "MX", "MY", "PL", "RO", "SK", "ZA"], multiplier: 0.7 },
  { countries: ["CO", "ID", "IN", "PE", "PH", "TH", "TR", "VN"], multiplier: 0.6 },
  { countries: ["BD", "EG", "KE", "MA", "NG", "PK", "UA"], multiplier: 0.5 },
] as const satisfies readonly { countries: readonly CountryCode[]; multiplier: number }[]

const PPP_MULTIPLIERS: ReadonlyMap<string, number> = new Map(
  PPP_TIERS.flatMap(({ countries, multiplier }) => countries.map((country) => [country, multiplier] as const)),
)

export const getPppMultiplier = (countryCode: string | undefined): number =>
  PPP_MULTIPLIERS.get(countryCode?.toUpperCase() ?? "") ?? FULL_PRICE_MULTIPLIER

export const getPppPercentOff = (countryCode: string | undefined): number =>
  Math.round((FULL_PRICE_MULTIPLIER - getPppMultiplier(countryCode)) * PPP_PERCENT)

const CHARM_STEP = 10
const CHARM_ENDING = 9

const toCharmPrice = (amount: number): number =>
  Math.round((amount + CHARM_STEP - CHARM_ENDING) / CHARM_STEP) * CHARM_STEP - CHARM_STEP + CHARM_ENDING

export const applyPpp = ({ amount, multiplier }: { amount: number; multiplier: number }): number =>
  multiplier === FULL_PRICE_MULTIPLIER ? amount : toCharmPrice(amount * multiplier)

export const CURRENCY_FORMAT = { currency: "USD", maximumFractionDigits: 0, style: "currency" } as const

export const PPP_ATTRIBUTE = "data-ppp"

export const PPP_KEYS: readonly number[] = [
  FULL_PRICE_MULTIPLIER * PPP_PERCENT,
  ...PPP_TIERS.map(({ multiplier }) => Math.round(multiplier * PPP_PERCENT)),
]

export const pppMultiplierKey = (countryCode: string | undefined): number => Math.round(getPppMultiplier(countryCode) * PPP_PERCENT)
