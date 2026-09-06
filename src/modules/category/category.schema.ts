import { sql } from "drizzle-orm"
import { index, integer, sqliteTable, text } from "drizzle-orm/sqlite-core"

export const categoryIconEnum = { enumValues: ["Archive", "FolderOpen", "Puzzle"] } as const
export const categoryKindEnum = { enumValues: ["category", "collection"] } as const
export const categoryVisibilityEnum = { enumValues: ["public", "hidden"] } as const

export type CategoryIcon = (typeof categoryIconEnum.enumValues)[number]
export type CategoryKind = (typeof categoryKindEnum.enumValues)[number]
export type CategoryVisibility = (typeof categoryVisibilityEnum.enumValues)[number]

export const category = sqliteTable(
  "category",
  {
    createdAt: integer("created_at", { mode: "timestamp_ms" })
      .default(sql`(unixepoch() * 1000)`)
      .notNull(),
    description: text("description").notNull().default(""),
    icon: text("icon", { enum: categoryIconEnum.enumValues }).notNull().default("FolderOpen"),
    id: text("id").primaryKey(),
    kind: text("kind", { enum: categoryKindEnum.enumValues }).notNull().default("category"),
    name: text("name", { length: 255 }).notNull(),
    updatedAt: integer("updated_at", { mode: "timestamp_ms" })
      .default(sql`(unixepoch() * 1000)`)
      .$onUpdate(
        () =>
          /* @__PURE__ */
          new Date(),
      )
      .notNull(),
    visibility: text("visibility", { enum: categoryVisibilityEnum.enumValues }).notNull().default("public"),
  },
  (table) => [index("category_createdAt_idx").on(table.createdAt)],
)
