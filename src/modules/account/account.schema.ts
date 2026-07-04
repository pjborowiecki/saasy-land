import { relations } from "drizzle-orm"
import { index, pgTable, timestamp, uniqueIndex, uuid, varchar } from "drizzle-orm/pg-core"

import { user } from "~/src/modules/user/user.schema"

export const account = pgTable(
  "account",
  {
    accessToken: varchar("access_token", { length: 16_384 }),
    accessTokenExpiresAt: timestamp("access_token_expires_at", { withTimezone: true }),
    accountId: varchar("account_id", { length: 1024 }).notNull(),
    createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
    id: uuid("id").primaryKey(),
    idToken: varchar("id_token", { length: 16_384 }),
    password: varchar("password", { length: 1024 }),
    providerId: varchar("provider_id", { length: 128 }).notNull(),
    refreshToken: varchar("refresh_token", { length: 16_384 }),
    refreshTokenExpiresAt: timestamp("refresh_token_expires_at", { withTimezone: true }),
    scope: varchar("scope", { length: 8192 }),
    updatedAt: timestamp("updated_at", { withTimezone: true })
      .defaultNow()
      .$onUpdate(() => /* @__PURE__ */ new Date())
      .notNull(),
    userId: uuid("user_id")
      .notNull()
      .references(() => user.id, { onDelete: "cascade" }),
  },
  (table) => [
    index("account_userId_providerId_idx").on(table.userId, table.providerId),
    uniqueIndex("account_providerId_accountId_uidx").on(table.providerId, table.accountId),
  ],
)

export const accountRelations = relations(account, ({ one }) => ({
  user: one(user, {
    fields: [account.userId],
    references: [user.id],
  }),
}))
