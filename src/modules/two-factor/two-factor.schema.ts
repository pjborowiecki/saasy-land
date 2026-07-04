import { relations } from "drizzle-orm"
import { boolean, integer, pgTable, timestamp, uniqueIndex, uuid, varchar } from "drizzle-orm/pg-core"

import { user } from "~/src/modules/user/user.schema"

export const twoFactor = pgTable(
  "two_factor",
  {
    backupCodes: varchar("backup_codes", { length: 8192 }).notNull(),
    createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
    failedVerificationCount: integer("failed_verification_count").default(0).notNull(),
    id: uuid("id").primaryKey(),
    lockedUntil: timestamp("locked_until", { withTimezone: true }),
    secret: varchar("secret", { length: 1024 }).notNull(),
    updatedAt: timestamp("updated_at", { withTimezone: true })
      .defaultNow()
      .$onUpdate(() => /* @__PURE__ */ new Date())
      .notNull(),
    userId: uuid("user_id")
      .notNull()
      .references(() => user.id, { onDelete: "cascade" }),
    verified: boolean("verified").default(true).notNull(),
  },
  (table) => [uniqueIndex("twoFactor_userId_uidx").on(table.userId)],
)

export const twoFactorRelations = relations(twoFactor, ({ one }) => ({
  user: one(user, {
    fields: [twoFactor.userId],
    references: [user.id],
  }),
}))
