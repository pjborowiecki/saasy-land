import { index, pgTable, timestamp, uuid, varchar } from "drizzle-orm/pg-core"

export const verification = pgTable(
  "verification",
  {
    id: uuid("id").primaryKey(),
    identifier: varchar("identifier", { length: 512 }).notNull(),
    value: varchar("value", { length: 8192 }).notNull(),
    expiresAt: timestamp("expires_at", { withTimezone: true }).notNull(),
    createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
    updatedAt: timestamp("updated_at", { withTimezone: true })
      .defaultNow()
      .$onUpdate(() => /* @__PURE__ */ new Date())
      .notNull(),
  },
  (table) => [index("verification_identifier_idx").on(table.identifier)],
)
