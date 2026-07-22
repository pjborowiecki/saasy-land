import type { CountryCode } from "~/src/modules/_core/constants/country"
import { ValidationError } from "~/src/modules/_core/errors/validation.error"
import { nonEmptyTuple } from "~/src/modules/_core/utils/catalog"

export type TextDirection = "ltr" | "rtl"

export interface AppLocale {
  readonly code: string
  readonly languageAlpha2: string
  readonly languageAlpha3: string
  readonly regionAlpha2: CountryCode
  readonly regionAlpha3: string
  readonly dir: TextDirection
}

export const LOCALES = [
  { code: "af-ZA", dir: "ltr", languageAlpha2: "af", languageAlpha3: "afr", regionAlpha2: "ZA", regionAlpha3: "ZAF" },
  { code: "am-ET", dir: "ltr", languageAlpha2: "am", languageAlpha3: "amh", regionAlpha2: "ET", regionAlpha3: "ETH" },
  { code: "ar-AE", dir: "rtl", languageAlpha2: "ar", languageAlpha3: "ara", regionAlpha2: "AE", regionAlpha3: "ARE" },
  { code: "ar-EG", dir: "rtl", languageAlpha2: "ar", languageAlpha3: "ara", regionAlpha2: "EG", regionAlpha3: "EGY" },
  { code: "ar-SA", dir: "rtl", languageAlpha2: "ar", languageAlpha3: "ara", regionAlpha2: "SA", regionAlpha3: "SAU" },
  { code: "bg-BG", dir: "ltr", languageAlpha2: "bg", languageAlpha3: "bul", regionAlpha2: "BG", regionAlpha3: "BGR" },
  { code: "bn-BD", dir: "ltr", languageAlpha2: "bn", languageAlpha3: "ben", regionAlpha2: "BD", regionAlpha3: "BGD" },
  { code: "cs-CZ", dir: "ltr", languageAlpha2: "cs", languageAlpha3: "ces", regionAlpha2: "CZ", regionAlpha3: "CZE" },
  { code: "da-DK", dir: "ltr", languageAlpha2: "da", languageAlpha3: "dan", regionAlpha2: "DK", regionAlpha3: "DNK" },
  { code: "de-AT", dir: "ltr", languageAlpha2: "de", languageAlpha3: "deu", regionAlpha2: "AT", regionAlpha3: "AUT" },
  { code: "de-CH", dir: "ltr", languageAlpha2: "de", languageAlpha3: "deu", regionAlpha2: "CH", regionAlpha3: "CHE" },
  { code: "de-DE", dir: "ltr", languageAlpha2: "de", languageAlpha3: "deu", regionAlpha2: "DE", regionAlpha3: "DEU" },
  { code: "el-GR", dir: "ltr", languageAlpha2: "el", languageAlpha3: "ell", regionAlpha2: "GR", regionAlpha3: "GRC" },
  { code: "en-AU", dir: "ltr", languageAlpha2: "en", languageAlpha3: "eng", regionAlpha2: "AU", regionAlpha3: "AUS" },
  { code: "en-CA", dir: "ltr", languageAlpha2: "en", languageAlpha3: "eng", regionAlpha2: "CA", regionAlpha3: "CAN" },
  { code: "en-GB", dir: "ltr", languageAlpha2: "en", languageAlpha3: "eng", regionAlpha2: "GB", regionAlpha3: "GBR" },
  { code: "en-IN", dir: "ltr", languageAlpha2: "en", languageAlpha3: "eng", regionAlpha2: "IN", regionAlpha3: "IND" },
  { code: "en-US", dir: "ltr", languageAlpha2: "en", languageAlpha3: "eng", regionAlpha2: "US", regionAlpha3: "USA" },
  { code: "es-AR", dir: "ltr", languageAlpha2: "es", languageAlpha3: "spa", regionAlpha2: "AR", regionAlpha3: "ARG" },
  { code: "es-CO", dir: "ltr", languageAlpha2: "es", languageAlpha3: "spa", regionAlpha2: "CO", regionAlpha3: "COL" },
  { code: "es-ES", dir: "ltr", languageAlpha2: "es", languageAlpha3: "spa", regionAlpha2: "ES", regionAlpha3: "ESP" },
  { code: "es-MX", dir: "ltr", languageAlpha2: "es", languageAlpha3: "spa", regionAlpha2: "MX", regionAlpha3: "MEX" },
  { code: "fa-IR", dir: "rtl", languageAlpha2: "fa", languageAlpha3: "fas", regionAlpha2: "IR", regionAlpha3: "IRN" },
  { code: "fi-FI", dir: "ltr", languageAlpha2: "fi", languageAlpha3: "fin", regionAlpha2: "FI", regionAlpha3: "FIN" },
  { code: "fr-BE", dir: "ltr", languageAlpha2: "fr", languageAlpha3: "fra", regionAlpha2: "BE", regionAlpha3: "BEL" },
  { code: "fr-CA", dir: "ltr", languageAlpha2: "fr", languageAlpha3: "fra", regionAlpha2: "CA", regionAlpha3: "CAN" },
  { code: "fr-CH", dir: "ltr", languageAlpha2: "fr", languageAlpha3: "fra", regionAlpha2: "CH", regionAlpha3: "CHE" },
  { code: "fr-FR", dir: "ltr", languageAlpha2: "fr", languageAlpha3: "fra", regionAlpha2: "FR", regionAlpha3: "FRA" },
  { code: "he-IL", dir: "rtl", languageAlpha2: "he", languageAlpha3: "heb", regionAlpha2: "IL", regionAlpha3: "ISR" },
  { code: "hi-IN", dir: "ltr", languageAlpha2: "hi", languageAlpha3: "hin", regionAlpha2: "IN", regionAlpha3: "IND" },
  { code: "hu-HU", dir: "ltr", languageAlpha2: "hu", languageAlpha3: "hun", regionAlpha2: "HU", regionAlpha3: "HUN" },
  { code: "id-ID", dir: "ltr", languageAlpha2: "id", languageAlpha3: "ind", regionAlpha2: "ID", regionAlpha3: "IDN" },
  { code: "it-CH", dir: "ltr", languageAlpha2: "it", languageAlpha3: "ita", regionAlpha2: "CH", regionAlpha3: "CHE" },
  { code: "it-IT", dir: "ltr", languageAlpha2: "it", languageAlpha3: "ita", regionAlpha2: "IT", regionAlpha3: "ITA" },
  { code: "ja-JP", dir: "ltr", languageAlpha2: "ja", languageAlpha3: "jpn", regionAlpha2: "JP", regionAlpha3: "JPN" },
  { code: "ko-KR", dir: "ltr", languageAlpha2: "ko", languageAlpha3: "kor", regionAlpha2: "KR", regionAlpha3: "KOR" },
  { code: "nl-BE", dir: "ltr", languageAlpha2: "nl", languageAlpha3: "nld", regionAlpha2: "BE", regionAlpha3: "BEL" },
  { code: "nl-NL", dir: "ltr", languageAlpha2: "nl", languageAlpha3: "nld", regionAlpha2: "NL", regionAlpha3: "NLD" },
  { code: "no-NO", dir: "ltr", languageAlpha2: "no", languageAlpha3: "nor", regionAlpha2: "NO", regionAlpha3: "NOR" },
  { code: "pl-PL", dir: "ltr", languageAlpha2: "pl", languageAlpha3: "pol", regionAlpha2: "PL", regionAlpha3: "POL" },
  { code: "pt-BR", dir: "ltr", languageAlpha2: "pt", languageAlpha3: "por", regionAlpha2: "BR", regionAlpha3: "BRA" },
  { code: "pt-PT", dir: "ltr", languageAlpha2: "pt", languageAlpha3: "por", regionAlpha2: "PT", regionAlpha3: "PRT" },
  { code: "ro-RO", dir: "ltr", languageAlpha2: "ro", languageAlpha3: "ron", regionAlpha2: "RO", regionAlpha3: "ROU" },
  { code: "ru-RU", dir: "ltr", languageAlpha2: "ru", languageAlpha3: "rus", regionAlpha2: "RU", regionAlpha3: "RUS" },
  { code: "sk-SK", dir: "ltr", languageAlpha2: "sk", languageAlpha3: "slk", regionAlpha2: "SK", regionAlpha3: "SVK" },
  { code: "sv-SE", dir: "ltr", languageAlpha2: "sv", languageAlpha3: "swe", regionAlpha2: "SE", regionAlpha3: "SWE" },
  { code: "th-TH", dir: "ltr", languageAlpha2: "th", languageAlpha3: "tha", regionAlpha2: "TH", regionAlpha3: "THA" },
  { code: "tr-TR", dir: "ltr", languageAlpha2: "tr", languageAlpha3: "tur", regionAlpha2: "TR", regionAlpha3: "TUR" },
  { code: "uk-UA", dir: "ltr", languageAlpha2: "uk", languageAlpha3: "ukr", regionAlpha2: "UA", regionAlpha3: "UKR" },
  { code: "ur-PK", dir: "rtl", languageAlpha2: "ur", languageAlpha3: "urd", regionAlpha2: "PK", regionAlpha3: "PAK" },
  { code: "vi-VN", dir: "ltr", languageAlpha2: "vi", languageAlpha3: "vie", regionAlpha2: "VN", regionAlpha3: "VNM" },
  { code: "zh-CN", dir: "ltr", languageAlpha2: "zh", languageAlpha3: "zho", regionAlpha2: "CN", regionAlpha3: "CHN" },
  { code: "zh-HK", dir: "ltr", languageAlpha2: "zh", languageAlpha3: "zho", regionAlpha2: "HK", regionAlpha3: "HKG" },
  { code: "zh-TW", dir: "ltr", languageAlpha2: "zh", languageAlpha3: "zho", regionAlpha2: "TW", regionAlpha3: "TWN" },
] as const satisfies readonly AppLocale[]

export type LocaleCode = (typeof LOCALES)[number]["code"]

const LOCALE_BY_CODE = new Map<string, (typeof LOCALES)[number]>(LOCALES.map((locale) => [locale.code, locale]))

function isLocaleCode(value: string): value is LocaleCode {
  return LOCALE_BY_CODE.has(value)
}

export const LOCALE_CODES = nonEmptyTuple(LOCALES.map((locale) => locale.code))

export class Locale {
  static readonly DEFAULT_CODE: LocaleCode = "en-US"

  readonly code: LocaleCode
  readonly languageAlpha2: string
  readonly languageAlpha3: string
  readonly regionAlpha2: CountryCode
  readonly regionAlpha3: string
  readonly dir: TextDirection

  private constructor(meta: (typeof LOCALES)[number]) {
    this.code = meta.code
    this.languageAlpha2 = meta.languageAlpha2
    this.languageAlpha3 = meta.languageAlpha3
    this.regionAlpha2 = meta.regionAlpha2
    this.regionAlpha3 = meta.regionAlpha3
    this.dir = meta.dir
  }

  static create(code: string): Locale {
    const normalized = code.trim()
    if (!isLocaleCode(normalized)) {
      throw new ValidationError(`Unsupported locale: ${code}`)
    }
    return new Locale(LOCALE_BY_CODE.get(normalized)!)
  }

  static default(): Locale {
    return Locale.create(Locale.DEFAULT_CODE)
  }

  get messageKey(): `locales.${LocaleCode}` {
    return `locales.${this.code}`
  }

  equals(other: Locale): boolean {
    return this.code === other.code
  }

  toString(): string {
    return this.code
  }
}
