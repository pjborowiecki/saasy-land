import { ValidationError } from "~/src/modules/_core/errors/validation.error"
import { nonEmptyTuple } from "~/src/modules/_core/utils/catalog"

export interface IsoCurrency {
  readonly numeric: string
  readonly exponent: number
}

export const CURRENCIES = {
  AED: { exponent: 2, numeric: "784" },
  AFN: { exponent: 2, numeric: "971" },
  ALL: { exponent: 2, numeric: "008" },
  AMD: { exponent: 2, numeric: "051" },
  ANG: { exponent: 2, numeric: "532" },
  AOA: { exponent: 2, numeric: "973" },
  ARS: { exponent: 2, numeric: "032" },
  AUD: { exponent: 2, numeric: "036" },
  AWG: { exponent: 2, numeric: "533" },
  AZN: { exponent: 2, numeric: "944" },
  BAM: { exponent: 2, numeric: "977" },
  BBD: { exponent: 2, numeric: "052" },
  BDT: { exponent: 2, numeric: "050" },
  BGN: { exponent: 2, numeric: "975" },
  BHD: { exponent: 3, numeric: "048" },
  BIF: { exponent: 0, numeric: "108" },
  BMD: { exponent: 2, numeric: "060" },
  BND: { exponent: 2, numeric: "096" },
  BOB: { exponent: 2, numeric: "068" },
  BRL: { exponent: 2, numeric: "986" },
  BSD: { exponent: 2, numeric: "044" },
  BTN: { exponent: 2, numeric: "064" },
  BWP: { exponent: 2, numeric: "072" },
  BYN: { exponent: 2, numeric: "933" },
  BZD: { exponent: 2, numeric: "084" },
  CAD: { exponent: 2, numeric: "124" },
  CDF: { exponent: 2, numeric: "976" },
  CHF: { exponent: 2, numeric: "756" },
  CLP: { exponent: 0, numeric: "152" },
  CNY: { exponent: 2, numeric: "156" },
  COP: { exponent: 2, numeric: "170" },
  CRC: { exponent: 2, numeric: "188" },
  CUP: { exponent: 2, numeric: "192" },
  CVE: { exponent: 2, numeric: "132" },
  CZK: { exponent: 2, numeric: "203" },
  DJF: { exponent: 0, numeric: "262" },
  DKK: { exponent: 2, numeric: "208" },
  DOP: { exponent: 2, numeric: "214" },
  DZD: { exponent: 2, numeric: "012" },
  EGP: { exponent: 2, numeric: "818" },
  ERN: { exponent: 2, numeric: "232" },
  ETB: { exponent: 2, numeric: "230" },
  EUR: { exponent: 2, numeric: "978" },
  FJD: { exponent: 2, numeric: "242" },
  FKP: { exponent: 2, numeric: "238" },
  GBP: { exponent: 2, numeric: "826" },
  GEL: { exponent: 2, numeric: "981" },
  GHS: { exponent: 2, numeric: "936" },
  GIP: { exponent: 2, numeric: "292" },
  GMD: { exponent: 2, numeric: "270" },
  GNF: { exponent: 0, numeric: "324" },
  GTQ: { exponent: 2, numeric: "320" },
  GYD: { exponent: 2, numeric: "328" },
  HKD: { exponent: 2, numeric: "344" },
  HNL: { exponent: 2, numeric: "340" },
  HRK: { exponent: 2, numeric: "191" },
  HTG: { exponent: 2, numeric: "332" },
  HUF: { exponent: 2, numeric: "348" },
  IDR: { exponent: 2, numeric: "360" },
  ILS: { exponent: 2, numeric: "376" },
  INR: { exponent: 2, numeric: "356" },
  IQD: { exponent: 3, numeric: "368" },
  IRR: { exponent: 2, numeric: "364" },
  ISK: { exponent: 0, numeric: "352" },
  JMD: { exponent: 2, numeric: "388" },
  JOD: { exponent: 3, numeric: "400" },
  JPY: { exponent: 0, numeric: "392" },
  KES: { exponent: 2, numeric: "404" },
  KGS: { exponent: 2, numeric: "417" },
  KHR: { exponent: 2, numeric: "116" },
  KMF: { exponent: 0, numeric: "174" },
  KPW: { exponent: 2, numeric: "408" },
  KRW: { exponent: 0, numeric: "410" },
  KWD: { exponent: 3, numeric: "414" },
  KYD: { exponent: 2, numeric: "136" },
  KZT: { exponent: 2, numeric: "398" },
  LAK: { exponent: 2, numeric: "418" },
  LBP: { exponent: 2, numeric: "422" },
  LKR: { exponent: 2, numeric: "144" },
  LRD: { exponent: 2, numeric: "430" },
  LSL: { exponent: 2, numeric: "426" },
  LYD: { exponent: 3, numeric: "434" },
  MAD: { exponent: 2, numeric: "504" },
  MDL: { exponent: 2, numeric: "498" },
  MGA: { exponent: 2, numeric: "969" },
  MKD: { exponent: 2, numeric: "807" },
  MMK: { exponent: 2, numeric: "104" },
  MNT: { exponent: 2, numeric: "496" },
  MOP: { exponent: 2, numeric: "446" },
  MRU: { exponent: 2, numeric: "929" },
  MUR: { exponent: 2, numeric: "480" },
  MVR: { exponent: 2, numeric: "462" },
  MWK: { exponent: 2, numeric: "454" },
  MXN: { exponent: 2, numeric: "484" },
  MYR: { exponent: 2, numeric: "458" },
  MZN: { exponent: 2, numeric: "943" },
  NAD: { exponent: 2, numeric: "516" },
  NGN: { exponent: 2, numeric: "566" },
  NIO: { exponent: 2, numeric: "558" },
  NOK: { exponent: 2, numeric: "578" },
  NPR: { exponent: 2, numeric: "524" },
  NZD: { exponent: 2, numeric: "554" },
  OMR: { exponent: 3, numeric: "512" },
  PAB: { exponent: 2, numeric: "590" },
  PEN: { exponent: 2, numeric: "604" },
  PGK: { exponent: 2, numeric: "598" },
  PHP: { exponent: 2, numeric: "608" },
  PKR: { exponent: 2, numeric: "586" },
  PLN: { exponent: 2, numeric: "985" },
  PYG: { exponent: 0, numeric: "600" },
  QAR: { exponent: 2, numeric: "634" },
  RON: { exponent: 2, numeric: "946" },
  RSD: { exponent: 2, numeric: "941" },
  RUB: { exponent: 2, numeric: "643" },
  RWF: { exponent: 0, numeric: "646" },
  SAR: { exponent: 2, numeric: "682" },
  SBD: { exponent: 2, numeric: "090" },
  SCR: { exponent: 2, numeric: "690" },
  SDG: { exponent: 2, numeric: "938" },
  SEK: { exponent: 2, numeric: "752" },
  SGD: { exponent: 2, numeric: "702" },
  SHP: { exponent: 2, numeric: "654" },
  SLL: { exponent: 2, numeric: "694" },
  SOS: { exponent: 2, numeric: "706" },
  SRD: { exponent: 2, numeric: "968" },
  SSP: { exponent: 2, numeric: "728" },
  STN: { exponent: 2, numeric: "930" },
  SVC: { exponent: 2, numeric: "222" },
  SYP: { exponent: 2, numeric: "760" },
  SZL: { exponent: 2, numeric: "748" },
  THB: { exponent: 2, numeric: "764" },
  TJS: { exponent: 2, numeric: "972" },
  TMT: { exponent: 2, numeric: "934" },
  TND: { exponent: 3, numeric: "788" },
  TOP: { exponent: 2, numeric: "776" },
  TRY: { exponent: 2, numeric: "949" },
  TTD: { exponent: 2, numeric: "780" },
  TWD: { exponent: 2, numeric: "901" },
  TZS: { exponent: 2, numeric: "834" },
  UAH: { exponent: 2, numeric: "980" },
  UGX: { exponent: 0, numeric: "800" },
  USD: { exponent: 2, numeric: "840" },
  UYU: { exponent: 2, numeric: "858" },
  UZS: { exponent: 2, numeric: "860" },
  VES: { exponent: 2, numeric: "928" },
  VND: { exponent: 0, numeric: "704" },
  VUV: { exponent: 0, numeric: "548" },
  WST: { exponent: 2, numeric: "882" },
  XAF: { exponent: 0, numeric: "950" },
  XCD: { exponent: 2, numeric: "951" },
  XOF: { exponent: 0, numeric: "952" },
  XPF: { exponent: 0, numeric: "953" },
  YER: { exponent: 2, numeric: "886" },
  ZAR: { exponent: 2, numeric: "710" },
  ZMW: { exponent: 2, numeric: "967" },
  ZWG: { exponent: 2, numeric: "924" },
} as const satisfies Record<string, IsoCurrency>

export type CurrencyCode = keyof typeof CURRENCIES

function isCurrencyCode(value: string): value is CurrencyCode {
  return Object.hasOwn(CURRENCIES, value)
}

export const CURRENCY_CODES = nonEmptyTuple(Object.keys(CURRENCIES).filter((code): code is CurrencyCode => isCurrencyCode(code)))

export const DEFAULT_CURRENCY_CODE: CurrencyCode = "USD"

export class Currency {
  static readonly DEFAULT_CODE: CurrencyCode = DEFAULT_CURRENCY_CODE

  readonly code: CurrencyCode
  readonly numeric: string
  readonly exponent: number

  private constructor(code: CurrencyCode, meta: IsoCurrency) {
    this.code = code
    this.numeric = meta.numeric
    this.exponent = meta.exponent
  }

  static create(code: string): Currency {
    const normalized = code.trim().toUpperCase()
    if (!isCurrencyCode(normalized)) {
      throw new ValidationError(`Unsupported currency: ${code}`)
    }
    return new Currency(normalized, CURRENCIES[normalized])
  }

  static default(): Currency {
    return Currency.create(Currency.DEFAULT_CODE)
  }

  get messageKey(): `currencies.${CurrencyCode}` {
    return `currencies.${this.code}`
  }

  equals(other: Currency): boolean {
    return this.code === other.code
  }

  toString(): string {
    return this.code
  }
}
