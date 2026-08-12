import { I18N } from "~/src/integrations/next-intl/i18n.config"
import { getLocaleMessagesDir, loadLocaleMessagesFromDir } from "~/src/integrations/next-intl/i18n.utils"

function isNestedRecord(value: unknown): value is Record<string, unknown> {
  return value !== null && typeof value === "object" && !Array.isArray(value)
}

function flattenMessageKeys(value: unknown, prefix = ""): string[] {
  if (!isNestedRecord(value)) {
    return prefix.length > 0 ? [prefix] : []
  }

  return Object.entries(value).flatMap(([key, nested]) => {
    const path = prefix.length > 0 ? `${prefix}.${key}` : key

    if (isNestedRecord(nested)) {
      return flattenMessageKeys(nested, path)
    }

    return [path]
  })
}

describe("load locale messages from dir component", () => {
  const messagesDir = getLocaleMessagesDir()

  it("loads and nests namespace files for the default locale", () => {
    expect.hasAssertions()
    const messages = loadLocaleMessagesFromDir(I18N.DEFAULT_LOCALE, messagesDir)
    expect(messages.pages.landing.hero.ctaPrimary).toBeTypeOf("string")
    expect(messages.auth.form.placeholders.email).toBeTypeOf("string")
  })

  it("returns equivalent messages for repeated loads", () => {
    expect.hasAssertions()
    const first = loadLocaleMessagesFromDir(I18N.DEFAULT_LOCALE, messagesDir)
    const second = loadLocaleMessagesFromDir(I18N.DEFAULT_LOCALE, messagesDir)
    expect(second).toStrictEqual(first)
  })

  it("keeps translation keys in sync across locales", () => {
    expect.hasAssertions()
    const sourceKeys = flattenMessageKeys(loadLocaleMessagesFromDir(I18N.DEFAULT_LOCALE, messagesDir))
    const nonDefaultLocales = I18N.LOCALES.filter((locale) => locale !== I18N.DEFAULT_LOCALE)
    for (const locale of nonDefaultLocales) {
      const localeKeys = flattenMessageKeys(loadLocaleMessagesFromDir(locale, messagesDir))
      expect(localeKeys.toSorted()).toStrictEqual(sourceKeys.toSorted())
    }
  })
})
