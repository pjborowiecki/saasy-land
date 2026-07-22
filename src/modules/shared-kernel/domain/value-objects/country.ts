import { nonEmptyTuple } from "~/src/modules/shared-kernel/domain/catalog"
import { ValidationError } from "~/src/modules/shared-kernel/domain/errors/validation.error"
import type { CurrencyCode } from "~/src/modules/shared-kernel/domain/value-objects/currency"

export interface IsoCountry {
  readonly alpha2: string
  readonly alpha3: string
  readonly numeric: string
  readonly currency: CurrencyCode
}

export const COUNTRIES = [
  { alpha2: "AD", alpha3: "AND", currency: "EUR", numeric: "020" },
  { alpha2: "AE", alpha3: "ARE", currency: "AED", numeric: "784" },
  { alpha2: "AF", alpha3: "AFG", currency: "AFN", numeric: "004" },
  { alpha2: "AG", alpha3: "ATG", currency: "XCD", numeric: "028" },
  { alpha2: "AI", alpha3: "AIA", currency: "XCD", numeric: "660" },
  { alpha2: "AL", alpha3: "ALB", currency: "ALL", numeric: "008" },
  { alpha2: "AM", alpha3: "ARM", currency: "AMD", numeric: "051" },
  { alpha2: "AO", alpha3: "AGO", currency: "AOA", numeric: "024" },
  { alpha2: "AR", alpha3: "ARG", currency: "ARS", numeric: "032" },
  { alpha2: "AS", alpha3: "ASM", currency: "USD", numeric: "016" },
  { alpha2: "AT", alpha3: "AUT", currency: "EUR", numeric: "040" },
  { alpha2: "AU", alpha3: "AUS", currency: "AUD", numeric: "036" },
  { alpha2: "AW", alpha3: "ABW", currency: "AWG", numeric: "533" },
  { alpha2: "AX", alpha3: "ALA", currency: "EUR", numeric: "248" },
  { alpha2: "AZ", alpha3: "AZE", currency: "AZN", numeric: "031" },
  { alpha2: "BA", alpha3: "BIH", currency: "BAM", numeric: "070" },
  { alpha2: "BB", alpha3: "BRB", currency: "BBD", numeric: "052" },
  { alpha2: "BD", alpha3: "BGD", currency: "BDT", numeric: "050" },
  { alpha2: "BE", alpha3: "BEL", currency: "EUR", numeric: "056" },
  { alpha2: "BF", alpha3: "BFA", currency: "XOF", numeric: "854" },
  { alpha2: "BG", alpha3: "BGR", currency: "BGN", numeric: "100" },
  { alpha2: "BH", alpha3: "BHR", currency: "BHD", numeric: "048" },
  { alpha2: "BI", alpha3: "BDI", currency: "BIF", numeric: "108" },
  { alpha2: "BJ", alpha3: "BEN", currency: "XOF", numeric: "204" },
  { alpha2: "BL", alpha3: "BLM", currency: "EUR", numeric: "652" },
  { alpha2: "BM", alpha3: "BMU", currency: "BMD", numeric: "060" },
  { alpha2: "BN", alpha3: "BRN", currency: "BND", numeric: "096" },
  { alpha2: "BO", alpha3: "BOL", currency: "BOB", numeric: "068" },
  { alpha2: "BQ", alpha3: "BES", currency: "USD", numeric: "535" },
  { alpha2: "BR", alpha3: "BRA", currency: "BRL", numeric: "076" },
  { alpha2: "BS", alpha3: "BHS", currency: "BSD", numeric: "044" },
  { alpha2: "BT", alpha3: "BTN", currency: "BTN", numeric: "064" },
  { alpha2: "BV", alpha3: "BVT", currency: "NOK", numeric: "074" },
  { alpha2: "BW", alpha3: "BWA", currency: "BWP", numeric: "072" },
  { alpha2: "BY", alpha3: "BLR", currency: "BYN", numeric: "112" },
  { alpha2: "BZ", alpha3: "BLZ", currency: "BZD", numeric: "084" },
  { alpha2: "CA", alpha3: "CAN", currency: "CAD", numeric: "124" },
  { alpha2: "CC", alpha3: "CCK", currency: "AUD", numeric: "166" },
  { alpha2: "CD", alpha3: "COD", currency: "CDF", numeric: "180" },
  { alpha2: "CF", alpha3: "CAF", currency: "XAF", numeric: "140" },
  { alpha2: "CG", alpha3: "COG", currency: "XAF", numeric: "178" },
  { alpha2: "CH", alpha3: "CHE", currency: "CHF", numeric: "756" },
  { alpha2: "CI", alpha3: "CIV", currency: "XOF", numeric: "384" },
  { alpha2: "CK", alpha3: "COK", currency: "NZD", numeric: "184" },
  { alpha2: "CL", alpha3: "CHL", currency: "CLP", numeric: "152" },
  { alpha2: "CM", alpha3: "CMR", currency: "XAF", numeric: "120" },
  { alpha2: "CN", alpha3: "CHN", currency: "CNY", numeric: "156" },
  { alpha2: "CO", alpha3: "COL", currency: "COP", numeric: "170" },
  { alpha2: "CR", alpha3: "CRI", currency: "CRC", numeric: "188" },
  { alpha2: "CU", alpha3: "CUB", currency: "CUP", numeric: "192" },
  { alpha2: "CV", alpha3: "CPV", currency: "CVE", numeric: "132" },
  { alpha2: "CW", alpha3: "CUW", currency: "ANG", numeric: "531" },
  { alpha2: "CX", alpha3: "CXR", currency: "AUD", numeric: "162" },
  { alpha2: "CY", alpha3: "CYP", currency: "EUR", numeric: "196" },
  { alpha2: "CZ", alpha3: "CZE", currency: "CZK", numeric: "203" },
  { alpha2: "DE", alpha3: "DEU", currency: "EUR", numeric: "276" },
  { alpha2: "DJ", alpha3: "DJI", currency: "DJF", numeric: "262" },
  { alpha2: "DK", alpha3: "DNK", currency: "DKK", numeric: "208" },
  { alpha2: "DM", alpha3: "DMA", currency: "XCD", numeric: "212" },
  { alpha2: "DO", alpha3: "DOM", currency: "DOP", numeric: "214" },
  { alpha2: "DZ", alpha3: "DZA", currency: "DZD", numeric: "012" },
  { alpha2: "EC", alpha3: "ECU", currency: "USD", numeric: "218" },
  { alpha2: "EE", alpha3: "EST", currency: "EUR", numeric: "233" },
  { alpha2: "EG", alpha3: "EGY", currency: "EGP", numeric: "818" },
  { alpha2: "EH", alpha3: "ESH", currency: "MAD", numeric: "073" },
  { alpha2: "ER", alpha3: "ERI", currency: "ERN", numeric: "232" },
  { alpha2: "ES", alpha3: "ESP", currency: "EUR", numeric: "724" },
  { alpha2: "ET", alpha3: "ETH", currency: "ETB", numeric: "231" },
  { alpha2: "FI", alpha3: "FIN", currency: "EUR", numeric: "246" },
  { alpha2: "FJ", alpha3: "FJI", currency: "FJD", numeric: "242" },
  { alpha2: "FK", alpha3: "FLK", currency: "FKP", numeric: "238" },
  { alpha2: "FM", alpha3: "FSM", currency: "USD", numeric: "583" },
  { alpha2: "FO", alpha3: "FRO", currency: "DKK", numeric: "234" },
  { alpha2: "FR", alpha3: "FRA", currency: "EUR", numeric: "250" },
  { alpha2: "GA", alpha3: "GAB", currency: "XAF", numeric: "266" },
  { alpha2: "GB", alpha3: "GBR", currency: "GBP", numeric: "826" },
  { alpha2: "GD", alpha3: "GRD", currency: "XCD", numeric: "308" },
  { alpha2: "GE", alpha3: "GEO", currency: "GEL", numeric: "268" },
  { alpha2: "GF", alpha3: "GUF", currency: "EUR", numeric: "254" },
  { alpha2: "GG", alpha3: "GGY", currency: "GBP", numeric: "831" },
  { alpha2: "GH", alpha3: "GHA", currency: "GHS", numeric: "288" },
  { alpha2: "GI", alpha3: "GIB", currency: "GIP", numeric: "292" },
  { alpha2: "GL", alpha3: "GRL", currency: "DKK", numeric: "304" },
  { alpha2: "GM", alpha3: "GMB", currency: "GMD", numeric: "270" },
  { alpha2: "GN", alpha3: "GIN", currency: "GNF", numeric: "324" },
  { alpha2: "GP", alpha3: "GLP", currency: "EUR", numeric: "312" },
  { alpha2: "GQ", alpha3: "GNQ", currency: "XAF", numeric: "226" },
  { alpha2: "GR", alpha3: "GRC", currency: "EUR", numeric: "300" },
  { alpha2: "GS", alpha3: "SGS", currency: "GBP", numeric: "239" },
  { alpha2: "GT", alpha3: "GTM", currency: "GTQ", numeric: "320" },
  { alpha2: "GU", alpha3: "GUM", currency: "USD", numeric: "316" },
  { alpha2: "GW", alpha3: "GNB", currency: "XOF", numeric: "624" },
  { alpha2: "GY", alpha3: "GUY", currency: "GYD", numeric: "328" },
  { alpha2: "HK", alpha3: "HKG", currency: "HKD", numeric: "344" },
  { alpha2: "HM", alpha3: "HMD", currency: "AUD", numeric: "334" },
  { alpha2: "HN", alpha3: "HND", currency: "HNL", numeric: "340" },
  { alpha2: "HR", alpha3: "HRV", currency: "EUR", numeric: "191" },
  { alpha2: "HT", alpha3: "HTI", currency: "HTG", numeric: "332" },
  { alpha2: "HU", alpha3: "HUN", currency: "HUF", numeric: "348" },
  { alpha2: "ID", alpha3: "IDN", currency: "IDR", numeric: "360" },
  { alpha2: "IE", alpha3: "IRL", currency: "EUR", numeric: "372" },
  { alpha2: "IL", alpha3: "ISR", currency: "ILS", numeric: "376" },
  { alpha2: "IM", alpha3: "IMN", currency: "GBP", numeric: "833" },
  { alpha2: "IN", alpha3: "IND", currency: "INR", numeric: "356" },
  { alpha2: "IO", alpha3: "IOT", currency: "USD", numeric: "086" },
  { alpha2: "IQ", alpha3: "IRQ", currency: "IQD", numeric: "368" },
  { alpha2: "IR", alpha3: "IRN", currency: "IRR", numeric: "364" },
  { alpha2: "IS", alpha3: "ISL", currency: "ISK", numeric: "352" },
  { alpha2: "IT", alpha3: "ITA", currency: "EUR", numeric: "380" },
  { alpha2: "JE", alpha3: "JEY", currency: "GBP", numeric: "832" },
  { alpha2: "JM", alpha3: "JAM", currency: "JMD", numeric: "388" },
  { alpha2: "JO", alpha3: "JOR", currency: "JOD", numeric: "400" },
  { alpha2: "JP", alpha3: "JPN", currency: "JPY", numeric: "392" },
  { alpha2: "KE", alpha3: "KEN", currency: "KES", numeric: "404" },
  { alpha2: "KG", alpha3: "KGZ", currency: "KGS", numeric: "417" },
  { alpha2: "KH", alpha3: "KHM", currency: "KHR", numeric: "116" },
  { alpha2: "KI", alpha3: "KIR", currency: "AUD", numeric: "296" },
  { alpha2: "KM", alpha3: "COM", currency: "KMF", numeric: "174" },
  { alpha2: "KN", alpha3: "KNA", currency: "XCD", numeric: "659" },
  { alpha2: "KP", alpha3: "PRK", currency: "KPW", numeric: "408" },
  { alpha2: "KR", alpha3: "KOR", currency: "KRW", numeric: "410" },
  { alpha2: "KW", alpha3: "KWT", currency: "KWD", numeric: "414" },
  { alpha2: "KY", alpha3: "CYM", currency: "KYD", numeric: "136" },
  { alpha2: "KZ", alpha3: "KAZ", currency: "KZT", numeric: "398" },
  { alpha2: "LA", alpha3: "LAO", currency: "LAK", numeric: "418" },
  { alpha2: "LB", alpha3: "LBN", currency: "LBP", numeric: "422" },
  { alpha2: "LC", alpha3: "LCA", currency: "XCD", numeric: "662" },
  { alpha2: "LI", alpha3: "LIE", currency: "CHF", numeric: "438" },
  { alpha2: "LK", alpha3: "LKA", currency: "LKR", numeric: "144" },
  { alpha2: "LR", alpha3: "LBR", currency: "LRD", numeric: "430" },
  { alpha2: "LS", alpha3: "LSO", currency: "LSL", numeric: "426" },
  { alpha2: "LT", alpha3: "LTU", currency: "EUR", numeric: "440" },
  { alpha2: "LU", alpha3: "LUX", currency: "EUR", numeric: "442" },
  { alpha2: "LV", alpha3: "LVA", currency: "EUR", numeric: "428" },
  { alpha2: "LY", alpha3: "LBY", currency: "LYD", numeric: "434" },
  { alpha2: "MA", alpha3: "MAR", currency: "MAD", numeric: "504" },
  { alpha2: "MC", alpha3: "MCO", currency: "EUR", numeric: "492" },
  { alpha2: "MD", alpha3: "MDA", currency: "MDL", numeric: "498" },
  { alpha2: "ME", alpha3: "MNE", currency: "EUR", numeric: "499" },
  { alpha2: "MF", alpha3: "MAF", currency: "EUR", numeric: "663" },
  { alpha2: "MG", alpha3: "MDG", currency: "MGA", numeric: "450" },
  { alpha2: "MH", alpha3: "MHL", currency: "USD", numeric: "584" },
  { alpha2: "MK", alpha3: "MKD", currency: "MKD", numeric: "807" },
  { alpha2: "ML", alpha3: "MLI", currency: "XOF", numeric: "466" },
  { alpha2: "MM", alpha3: "MMR", currency: "MMK", numeric: "104" },
  { alpha2: "MN", alpha3: "MNG", currency: "MNT", numeric: "496" },
  { alpha2: "MO", alpha3: "MAC", currency: "MOP", numeric: "446" },
  { alpha2: "MP", alpha3: "MNP", currency: "USD", numeric: "580" },
  { alpha2: "MQ", alpha3: "MTQ", currency: "EUR", numeric: "474" },
  { alpha2: "MR", alpha3: "MRT", currency: "MRU", numeric: "478" },
  { alpha2: "MS", alpha3: "MSR", currency: "XCD", numeric: "500" },
  { alpha2: "MT", alpha3: "MLT", currency: "EUR", numeric: "470" },
  { alpha2: "MU", alpha3: "MUS", currency: "MUR", numeric: "480" },
  { alpha2: "MV", alpha3: "MDV", currency: "MVR", numeric: "462" },
  { alpha2: "MW", alpha3: "MWI", currency: "MWK", numeric: "454" },
  { alpha2: "MX", alpha3: "MEX", currency: "MXN", numeric: "484" },
  { alpha2: "MY", alpha3: "MYS", currency: "MYR", numeric: "458" },
  { alpha2: "MZ", alpha3: "MOZ", currency: "MZN", numeric: "508" },
  { alpha2: "NA", alpha3: "NAM", currency: "NAD", numeric: "516" },
  { alpha2: "NC", alpha3: "NCL", currency: "XPF", numeric: "540" },
  { alpha2: "NE", alpha3: "NER", currency: "XOF", numeric: "562" },
  { alpha2: "NF", alpha3: "NFK", currency: "AUD", numeric: "574" },
  { alpha2: "NG", alpha3: "NGA", currency: "NGN", numeric: "566" },
  { alpha2: "NI", alpha3: "NIC", currency: "NIO", numeric: "558" },
  { alpha2: "NL", alpha3: "NLD", currency: "EUR", numeric: "528" },
  { alpha2: "NO", alpha3: "NOR", currency: "NOK", numeric: "578" },
  { alpha2: "NP", alpha3: "NPL", currency: "NPR", numeric: "524" },
  { alpha2: "NR", alpha3: "NRU", currency: "AUD", numeric: "520" },
  { alpha2: "NU", alpha3: "NIU", currency: "NZD", numeric: "570" },
  { alpha2: "NZ", alpha3: "NZL", currency: "NZD", numeric: "554" },
  { alpha2: "OM", alpha3: "OMN", currency: "OMR", numeric: "512" },
  { alpha2: "PA", alpha3: "PAN", currency: "PAB", numeric: "591" },
  { alpha2: "PE", alpha3: "PER", currency: "PEN", numeric: "604" },
  { alpha2: "PF", alpha3: "PYF", currency: "XPF", numeric: "258" },
  { alpha2: "PG", alpha3: "PNG", currency: "PGK", numeric: "598" },
  { alpha2: "PH", alpha3: "PHL", currency: "PHP", numeric: "608" },
  { alpha2: "PK", alpha3: "PAK", currency: "PKR", numeric: "586" },
  { alpha2: "PL", alpha3: "POL", currency: "PLN", numeric: "616" },
  { alpha2: "PM", alpha3: "SPM", currency: "EUR", numeric: "666" },
  { alpha2: "PN", alpha3: "PCN", currency: "NZD", numeric: "612" },
  { alpha2: "PR", alpha3: "PRI", currency: "USD", numeric: "630" },
  { alpha2: "PS", alpha3: "PSE", currency: "ILS", numeric: "275" },
  { alpha2: "PT", alpha3: "PRT", currency: "EUR", numeric: "620" },
  { alpha2: "PW", alpha3: "PLW", currency: "USD", numeric: "585" },
  { alpha2: "PY", alpha3: "PRY", currency: "PYG", numeric: "600" },
  { alpha2: "QA", alpha3: "QAT", currency: "QAR", numeric: "634" },
  { alpha2: "RE", alpha3: "REU", currency: "EUR", numeric: "638" },
  { alpha2: "RO", alpha3: "ROU", currency: "RON", numeric: "642" },
  { alpha2: "RS", alpha3: "SRB", currency: "RSD", numeric: "688" },
  { alpha2: "RU", alpha3: "RUS", currency: "RUB", numeric: "643" },
  { alpha2: "RW", alpha3: "RWA", currency: "RWF", numeric: "646" },
  { alpha2: "SA", alpha3: "SAU", currency: "SAR", numeric: "682" },
  { alpha2: "SB", alpha3: "SLB", currency: "SBD", numeric: "090" },
  { alpha2: "SC", alpha3: "SYC", currency: "SCR", numeric: "690" },
  { alpha2: "SD", alpha3: "SDN", currency: "SDG", numeric: "729" },
  { alpha2: "SE", alpha3: "SWE", currency: "SEK", numeric: "752" },
  { alpha2: "SG", alpha3: "SGP", currency: "SGD", numeric: "702" },
  { alpha2: "SH", alpha3: "SHN", currency: "SHP", numeric: "654" },
  { alpha2: "SI", alpha3: "SVN", currency: "EUR", numeric: "705" },
  { alpha2: "SJ", alpha3: "SJM", currency: "NOK", numeric: "744" },
  { alpha2: "SK", alpha3: "SVK", currency: "EUR", numeric: "703" },
  { alpha2: "SL", alpha3: "SLE", currency: "SLL", numeric: "694" },
  { alpha2: "SM", alpha3: "SMR", currency: "EUR", numeric: "674" },
  { alpha2: "SN", alpha3: "SEN", currency: "XOF", numeric: "686" },
  { alpha2: "SO", alpha3: "SOM", currency: "SOS", numeric: "706" },
  { alpha2: "SR", alpha3: "SUR", currency: "SRD", numeric: "740" },
  { alpha2: "SS", alpha3: "SSD", currency: "SSP", numeric: "728" },
  { alpha2: "ST", alpha3: "STP", currency: "STN", numeric: "678" },
  { alpha2: "SV", alpha3: "SLV", currency: "USD", numeric: "222" },
  { alpha2: "SX", alpha3: "SXM", currency: "ANG", numeric: "534" },
  { alpha2: "SY", alpha3: "SYR", currency: "SYP", numeric: "760" },
  { alpha2: "SZ", alpha3: "SWZ", currency: "SZL", numeric: "748" },
  { alpha2: "TC", alpha3: "TCA", currency: "USD", numeric: "796" },
  { alpha2: "TD", alpha3: "TCD", currency: "XAF", numeric: "148" },
  { alpha2: "TF", alpha3: "ATF", currency: "EUR", numeric: "260" },
  { alpha2: "TG", alpha3: "TGO", currency: "XOF", numeric: "768" },
  { alpha2: "TH", alpha3: "THA", currency: "THB", numeric: "764" },
  { alpha2: "TJ", alpha3: "TJK", currency: "TJS", numeric: "762" },
  { alpha2: "TK", alpha3: "TKL", currency: "NZD", numeric: "772" },
  { alpha2: "TL", alpha3: "TLS", currency: "USD", numeric: "626" },
  { alpha2: "TM", alpha3: "TKM", currency: "TMT", numeric: "795" },
  { alpha2: "TN", alpha3: "TUN", currency: "TND", numeric: "788" },
  { alpha2: "TO", alpha3: "TON", currency: "TOP", numeric: "776" },
  { alpha2: "TR", alpha3: "TUR", currency: "TRY", numeric: "792" },
  { alpha2: "TT", alpha3: "TTO", currency: "TTD", numeric: "780" },
  { alpha2: "TV", alpha3: "TUV", currency: "AUD", numeric: "798" },
  { alpha2: "TW", alpha3: "TWN", currency: "TWD", numeric: "158" },
  { alpha2: "TZ", alpha3: "TZA", currency: "TZS", numeric: "834" },
  { alpha2: "UA", alpha3: "UKR", currency: "UAH", numeric: "804" },
  { alpha2: "UG", alpha3: "UGA", currency: "UGX", numeric: "800" },
  { alpha2: "UM", alpha3: "UMI", currency: "USD", numeric: "581" },
  { alpha2: "US", alpha3: "USA", currency: "USD", numeric: "840" },
  { alpha2: "UY", alpha3: "URY", currency: "UYU", numeric: "858" },
  { alpha2: "UZ", alpha3: "UZB", currency: "UZS", numeric: "860" },
  { alpha2: "VA", alpha3: "VAT", currency: "EUR", numeric: "336" },
  { alpha2: "VC", alpha3: "VCT", currency: "XCD", numeric: "670" },
  { alpha2: "VE", alpha3: "VEN", currency: "VES", numeric: "862" },
  { alpha2: "VG", alpha3: "VGB", currency: "USD", numeric: "092" },
  { alpha2: "VI", alpha3: "VIR", currency: "USD", numeric: "850" },
  { alpha2: "VN", alpha3: "VNM", currency: "VND", numeric: "704" },
  { alpha2: "VU", alpha3: "VUT", currency: "VUV", numeric: "548" },
  { alpha2: "WF", alpha3: "WLF", currency: "XPF", numeric: "876" },
  { alpha2: "WS", alpha3: "WSM", currency: "WST", numeric: "882" },
  { alpha2: "YE", alpha3: "YEM", currency: "YER", numeric: "887" },
  { alpha2: "YT", alpha3: "MYT", currency: "EUR", numeric: "175" },
  { alpha2: "ZA", alpha3: "ZAF", currency: "ZAR", numeric: "710" },
  { alpha2: "ZM", alpha3: "ZMB", currency: "ZMW", numeric: "894" },
  { alpha2: "ZW", alpha3: "ZWE", currency: "ZWG", numeric: "716" },
] as const satisfies readonly IsoCountry[]

export type CountryCode = (typeof COUNTRIES)[number]["alpha2"]

const COUNTRY_BY_ALPHA2 = new Map<string, (typeof COUNTRIES)[number]>(COUNTRIES.map((country) => [country.alpha2, country]))

function isCountryCode(value: string): value is CountryCode {
  return COUNTRY_BY_ALPHA2.has(value)
}

export const COUNTRY_CODES = nonEmptyTuple(COUNTRIES.map((country) => country.alpha2))

export class Country {
  static readonly DEFAULT_CODE: CountryCode = "US"

  readonly alpha2: CountryCode
  readonly alpha3: string
  readonly numeric: string
  readonly currency: CurrencyCode

  private constructor(meta: (typeof COUNTRIES)[number]) {
    this.alpha2 = meta.alpha2
    this.alpha3 = meta.alpha3
    this.numeric = meta.numeric
    this.currency = meta.currency
  }

  static create(code: string): Country {
    const normalized = code.trim().toUpperCase()
    if (!isCountryCode(normalized)) {
      throw new ValidationError(`Unsupported country: ${code}`)
    }
    return new Country(COUNTRY_BY_ALPHA2.get(normalized)!)
  }

  static default(): Country {
    return Country.create(Country.DEFAULT_CODE)
  }

  get messageKey(): `countries.${CountryCode}` {
    return `countries.${this.alpha2}`
  }

  equals(other: Country): boolean {
    return this.alpha2 === other.alpha2
  }

  toString(): string {
    return this.alpha2
  }
}
