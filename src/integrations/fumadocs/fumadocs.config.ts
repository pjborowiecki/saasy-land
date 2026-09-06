import { pageSchema } from "fumadocs-core/source/schema"
import { defineCollections, defineConfig, defineDocs } from "fumadocs-mdx/config"
import zod from "zod/v4"

export const docs = defineDocs({
  dir: "./content/docs",
})

const blogDateSchema = zod.union([zod.string(), zod.date()])

const blogFaqSchema = zod.array(zod.object({ answer: zod.string(), question: zod.string() }))

const blogSchema = pageSchema.extend({
  authorImage: zod.string().optional(),
  authorName: zod.string(),
  date: blogDateSchema,
  excerpt: zod.string().optional(),
  faq: blogFaqSchema.optional(),
  featured: zod.boolean().optional(),
  image: zod.string().optional(),
  published: zod.boolean().default(true),
  tags: zod.array(zod.string()).optional(),
  updated: blogDateSchema.optional(),
})

export const blog = defineCollections({
  dir: "./content/blog",
  schema: blogSchema,
  type: "doc",
})

export default defineConfig()
