import { blog, docs } from "collections/server"
import { loader } from "fumadocs-core/source"
import { lucideIconsPlugin } from "fumadocs-core/source/lucide-icons"
import { toFumadocsSource } from "fumadocs-mdx/runtime/server"

import { i18n } from "~/src/integrations/fumadocs/fumadocs.i18n"

export const source = loader({
  baseUrl: "/docs",
  source: docs.toFumadocsSource(),
  plugins: [lucideIconsPlugin()],
  i18n,
})

export const blogSource = loader({
  baseUrl: "/blog",
  source: toFumadocsSource(blog, []),
  i18n,
})
