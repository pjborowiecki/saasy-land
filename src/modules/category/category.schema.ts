import { index, pgEnum, pgTable, text, timestamp, uuid, varchar } from "drizzle-orm/pg-core"

export const categoryIconEnum = pgEnum("category_icon", ["Archive", "FolderOpen", "Puzzle"])
export const categoryKindEnum = pgEnum("category_kind", ["category", "collection"])
export const categoryVisibilityEnum = pgEnum("category_visibility", ["public", "hidden"])

export type CategoryIcon = (typeof categoryIconEnum.enumValues)[number]
export type CategoryKind = (typeof categoryKindEnum.enumValues)[number]
export type CategoryVisibility = (typeof categoryVisibilityEnum.enumValues)[number]

export const category = pgTable(
  "category",
  {
    createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
    description: text("description").notNull().default(""),
    icon: categoryIconEnum().notNull().default("FolderOpen"),
    id: uuid("id").primaryKey(),
    kind: categoryKindEnum().notNull().default("category"),
    name: varchar("name", { length: 255 }).notNull(),
    updatedAt: timestamp("updated_at", { withTimezone: true })
      .defaultNow()
      .$onUpdate(
        () =>
          /* @__PURE__ */
          new Date(),
      )
      .notNull(),
    visibility: categoryVisibilityEnum().notNull().default("public"),
  },
  (table) => [index("category_createdAt_idx").on(table.createdAt)],
)
