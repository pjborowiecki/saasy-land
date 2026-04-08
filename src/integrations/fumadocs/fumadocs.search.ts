import type { Language } from "@orama/orama"
import { createFromSource } from "fumadocs-core/search/server"

import type { Locale } from "~/src/constants/types"

import { source } from "~/src/integrations/fumadocs/fumadocs.source"

/**
 * Maps app locales (BCP-47, aligned with next-intl) to Orama {@link Language} ids.
 *
 * Fumadocs builds the search index with `createI18nSearchAPI`. When no `localeMap` is set, it
 * derives Orama options via `getTokenizer(locale)`, which only matches **two-letter** codes from
 * Orama’s stemmer table (e.g. `en` → english). Values like `en-US` or `pl-PL` never match, so Orama
 * receives an invalid `language` string and throws `LANGUAGE_NOT_SUPPORTED`.
 *
 * Supplying `localeMap` on `createFromSource` is therefore the supported way to use BCP-47 locales
 * with the built-in Orama backend — see `Options["localeMap"]` in `fumadocs-core/search/server`.
 *
 * Polish: Orama’s bundled stemmers do not include Polish. The closest available option for
 * inflected Slavic text is `czech` (West Slavic). If results are unsatisfactory, switch to a
 * hosted provider (Algolia, Orama Cloud, etc.) with explicit Polish language support.
 */
const oramaLocaleMap: Record<Locale, Language> = {
  "en-US": "english",
  "pl-PL": "czech",
}

/** Orama-backed handler: call `fumadocsSearch.GET(request)` from Elysia (or any Web Request API). */
export const fumadocsSearch = createFromSource(source, {
  localeMap: oramaLocaleMap,
})
