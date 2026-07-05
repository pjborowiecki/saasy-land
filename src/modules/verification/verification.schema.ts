import { index, pgTable, timestamp, uuid, varchar } from "drizzle-orm/pg-core"

export const verification = pgTable(
  "verification",
  {
    createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
    expiresAt: timestamp("expires_at", { withTimezone: true }).notNull(),
    id: uuid("id").primaryKey(),
    identifier: varchar("identifier", { length: 512 }).notNull(),
    updatedAt: timestamp("updated_at", { withTimezone: true })
      .defaultNow()
      .$onUpdate(
        () =>
          /* @__PURE__ */
          new Date(),
      )
      .notNull(),
    value: varchar("value", { length: 8192 }).notNull(),
  },
  (table) => [
    index("verification_expiresAt_idx").on(table.expiresAt),
    index("verification_identifier_createdAt_idx").on(table.identifier, table.createdAt),
  ],
)
