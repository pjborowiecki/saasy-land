import { pageSchema } from "fumadocs-core/source/schema"
import { defineCollections, defineConfig, defineDocs } from "fumadocs-mdx/config"
import { z } from "zod"

export const docs = defineDocs({
  dir: "./src/integrations/fumadocs/content/docs",
})

const blogDateSchema = z.union([z.string(), z.date()])

const blogSchema = pageSchema.extend({
  authorImage: z.string().optional(),
  authorName: z.string(),
  date: blogDateSchema,
  excerpt: z.string().optional(),
  image: z.string().optional(),
  published: z.boolean().default(true),
  tags: z.array(z.string()).optional(),
})

export const blog = defineCollections({
  dir: "./src/integrations/fumadocs/content/blog",
  schema: blogSchema,
  type: "doc",
})

export default defineConfig()
