import { createSearchParamsCache, parseAsStringLiteral } from "nuqs/server"

import { DEFAULT_TAB, TAB_IDS } from "~/src/app/[locale]/(admin)/admin/users/_lib/tabs"

/** Users page URL parsers. Navigation options come from NuqsAdapter defaults. */
export const searchParams = {
  tab: parseAsStringLiteral(TAB_IDS).withDefault(DEFAULT_TAB),
}

export const searchParamsCache = createSearchParamsCache(searchParams)
