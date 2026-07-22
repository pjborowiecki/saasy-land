import { defineI18n } from "fumadocs-core/i18n"
import { defineI18nUI } from "fumadocs-ui/i18n"

import { I18N } from "~/src/integrations/next-intl/i18n.config"

export const i18n = defineI18n({
  defaultLanguage: I18N.DEFAULT_LOCALE,
  hideLocale: "always",
  languages: [...I18N.LOCALES],
  parser: "dot",
})

export const localeUiConfig = {
  "en-US": {
    chooseLanguage: "Choose a language",
    chooseTheme: "Theme",
    displayName: "English",
    editOnGithub: "Edit on GitHub",
    lastUpdate: "Last updated on",
    nextPage: "Next page",
    previousPage: "Previous page",
    search: "Search",
    searchNoResult: "No results found",
    toc: "On this page",
    tocNoHeadings: "No headings",
  },
  "pl-PL": {
    chooseLanguage: "Wybierz język",
    chooseTheme: "Motyw",
    displayName: "Polski",
    editOnGithub: "Edytuj na GitHubie",
    lastUpdate: "Ostatnia aktualizacja",
    nextPage: "Następna strona",
    previousPage: "Poprzednia strona",
    search: "Szukaj",
    searchNoResult: "Brak wyników",
    toc: "Na tej stronie",
    tocNoHeadings: "Brak nagłówków",
  },
}

export const i18nUI = defineI18nUI(i18n, localeUiConfig)
