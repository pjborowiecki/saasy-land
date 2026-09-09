import { createFromSource } from "fumadocs-core/search/server"

import { source } from "~/src/integrations/fumadocs/fumadocs.source"

export const fumadocsSearch = createFromSource(source)
