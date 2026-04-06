import { relations } from "drizzle-orm"
import { index, pgTable, timestamp, uuid, varchar } from "drizzle-orm/pg-core"

import { user } from "~/src/modules/user/user.schema"

export const account = pgTable(
  "account",
  {
    id: uuid("id").primaryKey(),
    accountId: varchar("account_id", { length: 1024 }).notNull(),
    providerId: varchar("provider_id", { length: 128 }).notNull(),
    userId: uuid("user_id")
      .notNull()
      .references(() => user.id, { onDelete: "cascade" }),
    accessToken: varchar("access_token", { length: 16_384 }),
    refreshToken: varchar("refresh_token", { length: 16_384 }),
    idToken: varchar("id_token", { length: 16_384 }),
    accessTokenExpiresAt: timestamp("access_token_expires_at", { withTimezone: true }),
    refreshTokenExpiresAt: timestamp("refresh_token_expires_at", { withTimezone: true }),
    scope: varchar("scope", { length: 8192 }),
    password: varchar("password", { length: 512 }),
    createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
    updatedAt: timestamp("updated_at", { withTimezone: true })
      .defaultNow()
      .$onUpdate(() => /* @__PURE__ */ new Date())
      .notNull(),
  },
  (table) => [index("account_userId_idx").on(table.userId)],
)

export const accountRelations = relations(account, ({ one }) => ({
  user: one(user, {
    fields: [account.userId],
    references: [user.id],
  }),
}))
