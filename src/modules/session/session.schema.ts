import { relations, sql } from "drizzle-orm"
import { index, integer, sqliteTable, text } from "drizzle-orm/sqlite-core"

import { user } from "~/src/modules/user/user.schema"

export const session = sqliteTable(
  "session",
  {
    createdAt: integer("created_at", { mode: "timestamp_ms" })
      .default(sql`(unixepoch() * 1000)`)
      .notNull(),
    expiresAt: integer("expires_at", { mode: "timestamp_ms" }).notNull(),
    id: text("id").primaryKey(),
    impersonatedBy: text("impersonated_by"),
    ipAddress: text("ip_address", { length: 45 }),
    token: text("token", { length: 16_384 }).notNull().unique(),
    updatedAt: integer("updated_at", { mode: "timestamp_ms" })
      .default(sql`(unixepoch() * 1000)`)
      .$onUpdate(
        () =>
          /* @__PURE__ */
          new Date(),
      )
      .notNull(),
    userAgent: text("user_agent", { length: 4096 }),
    userId: text("user_id")
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
