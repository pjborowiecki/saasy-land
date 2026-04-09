import { defineCollections, defineConfig, defineDocs, frontmatterSchema } from "fumadocs-mdx/config"
import { z } from "zod"

export const docs = defineDocs({
  dir: "./src/integrations/fumadocs/content/docs",
})

export const blog = defineCollections({
  type: "doc",
  dir: "./src/integrations/fumadocs/content/blog",
  schema: frontmatterSchema.extend({
    authorName: z.string(),
    date: z.union([z.string(), z.date()]),
    authorImage: z.string().optional(),
    image: z.string().optional(),
    excerpt: z.string().optional(),
    tags: z.array(z.string()).optional(),
    published: z.boolean().default(true),
  }),
})

export default defineConfig()
