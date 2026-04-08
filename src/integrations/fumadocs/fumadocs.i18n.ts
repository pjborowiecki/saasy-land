import { defineI18n } from "fumadocs-core/i18n"
import { defineI18nUI } from "fumadocs-ui/i18n"

import { CONSTANTS } from "~/src/constants"

export const i18n = defineI18n({
  defaultLanguage: CONSTANTS.DEFAULT_LOCALE,
  languages: [...CONSTANTS.LOCALES],
  hideLocale: "always",
  parser: "dot",
})

export const localeUiConfig = {
  "en-US": {
    displayName: "English",
    search: "Search",
    searchNoResult: "No results found",
    toc: "On this page",
    tocNoHeadings: "No headings",
    lastUpdate: "Last updated on",
    chooseLanguage: "Choose a language",
    nextPage: "Next page",
    previousPage: "Previous page",
    chooseTheme: "Theme",
    editOnGithub: "Edit on GitHub",
  },
  "pl-PL": {
    displayName: "Polski",
    search: "Szukaj",
    searchNoResult: "Brak wyników",
    toc: "Na tej stronie",
    tocNoHeadings: "Brak nagłówków",
    lastUpdate: "Ostatnia aktualizacja",
    chooseLanguage: "Wybierz język",
    nextPage: "Następna strona",
    previousPage: "Poprzednia strona",
    chooseTheme: "Motyw",
    editOnGithub: "Edytuj na GitHubie",
  },
}

export const i18nUI = defineI18nUI(i18n, localeUiConfig)
