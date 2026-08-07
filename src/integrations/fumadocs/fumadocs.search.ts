import { createFromSource } from "fumadocs-core/search/server"

import { source } from "~/src/integrations/fumadocs/fumadocs.source"

/**
 * Search API for the docs.
 *
 * No `localeMap` is needed: fumadocs' default `multilingual` tokenizer handles every
 * locale with zero config. The option that used to map BCP-47 codes onto Orama stemmer
 * ids is deprecated — supplying it would build a separate database per locale.
 */
export const fumadocsSearch = createFromSource(source)

export const fumadocsSearchGet = fumadocsSearch.GET
