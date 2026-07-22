import { relations } from "drizzle-orm"
import { index, pgTable, timestamp, uuid, varchar } from "drizzle-orm/pg-core"

import { user } from "~/src/modules/identity-access/infrastructure/persistence/schema/user.table"

export const session = pgTable(
  "session",
  {
    createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
    expiresAt: timestamp("expires_at", { withTimezone: true }).notNull(),
    id: uuid("id").primaryKey(),
    impersonatedBy: uuid("impersonated_by"),
    ipAddress: varchar("ip_address", { length: 45 }),
    token: varchar("token", { length: 16_384 }).notNull().unique(),
    updatedAt: timestamp("updated_at", { withTimezone: true })
      .defaultNow()
      .$onUpdate(
        () =>
          /* @__PURE__ */
          new Date(),
      )
      .notNull(),
    userAgent: varchar("user_agent", { length: 4096 }),
    userId: uuid("user_id")
      .notNull()
      .references(() => user.id, { onDelete: "cascade" }),
  },
  (table) => [index("session_expiresAt_idx").on(table.expiresAt), index("session_userId_createdAt_idx").on(table.userId, table.createdAt)],
)

export const sessionRelations = relations(session, ({ one }) => ({
  user: one(user, {
    fields: [session.userId],
    references: [user.id],
  }),
}))
