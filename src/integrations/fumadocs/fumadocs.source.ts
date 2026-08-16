import { blog, docs } from "collections/server"
import { loader } from "fumadocs-core/source"
import { lucideIconsPlugin } from "fumadocs-core/source/lucide-icons"
import { toFumadocsSource } from "fumadocs-mdx/runtime/server"

import { i18n } from "~/src/integrations/fumadocs/fumadocs.i18n"

export const source = loader({
  baseUrl: "/docs",
  i18n,
  plugins: [lucideIconsPlugin()],
  source: docs.toFumadocsSource(),
})

export const blogSource = loader({
  baseUrl: "/blog",
  i18n,
  source: toFumadocsSource(blog, []),
})

export type BlogPost = ReturnType<typeof blogSource.getPages>[number]
