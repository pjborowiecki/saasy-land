import { relations, sql } from "drizzle-orm"
import { integer, sqliteTable, text, uniqueIndex } from "drizzle-orm/sqlite-core"

import { user } from "~/src/modules/user/user.schema"

const DEFAULT_FAILED_VERIFICATION_COUNT = 0

export const twoFactor = sqliteTable(
  "two_factor",
  {
    backupCodes: text("backup_codes", { length: 8192 }).notNull(),
    createdAt: integer("created_at", { mode: "timestamp_ms" })
      .default(sql`(unixepoch() * 1000)`)
      .notNull(),
    failedVerificationCount: integer("failed_verification_count").default(DEFAULT_FAILED_VERIFICATION_COUNT).notNull(),
    id: text("id").primaryKey(),
    lockedUntil: integer("locked_until", { mode: "timestamp_ms" }),
    secret: text("secret", { length: 1024 }).notNull(),
    updatedAt: integer("updated_at", { mode: "timestamp_ms" })
      .default(sql`(unixepoch() * 1000)`)
      .$onUpdate(
        () =>
          /* @__PURE__ */
          new Date(),
      )
      .notNull(),
    userId: text("user_id")
      .notNull()
      .references(() => user.id, { onDelete: "cascade" }),
    verified: integer("verified", { mode: "boolean" }).default(true).notNull(),
  },
  (table) => [uniqueIndex("twoFactor_userId_uidx").on(table.userId)],
)

export const twoFactorRelations = relations(twoFactor, ({ one }) => ({
  user: one(user, {
    fields: [twoFactor.userId],
    references: [user.id],
  }),
}))
