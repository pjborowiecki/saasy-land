import { relations, sql } from "drizzle-orm"
import { index, integer, sqliteTable, text, uniqueIndex } from "drizzle-orm/sqlite-core"

import { user } from "~/src/modules/user/user.schema"

export const account = sqliteTable(
  "account",
  {
    accessToken: text("access_token", { length: 16_384 }),
    accessTokenExpiresAt: integer("access_token_expires_at", { mode: "timestamp_ms" }),
    accountId: text("account_id", { length: 1024 }).notNull(),
    createdAt: integer("created_at", { mode: "timestamp_ms" })
      .default(sql`(unixepoch() * 1000)`)
      .notNull(),
    id: text("id").primaryKey(),
    idToken: text("id_token", { length: 16_384 }),
    password: text("password", { length: 1024 }),
    providerId: text("provider_id", { length: 128 }).notNull(),
    refreshToken: text("refresh_token", { length: 16_384 }),
    refreshTokenExpiresAt: integer("refresh_token_expires_at", { mode: "timestamp_ms" }),
    scope: text("scope", { length: 8192 }),
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
