import { relations, sql } from "drizzle-orm"
import { index, integer, sqliteTable, text } from "drizzle-orm/sqlite-core"

import { DEFAULT_ROLE_CODE, ROLE_VALUES } from "~/src/integrations/better-auth/auth.access"

import { DEFAULT_TIMEZONE_CODE, TIMEZONE_CODES } from "~/src/modules/_core/constants/timezone"
import { account } from "~/src/modules/account/account.schema"
import { session } from "~/src/modules/session/session.schema"
import { twoFactor } from "~/src/modules/two-factor/two-factor.schema"

export const userRoleEnum = { enumValues: ROLE_VALUES } as const
export const userTimezoneEnum = { enumValues: TIMEZONE_CODES } as const

export const user = sqliteTable(
  "user",
  {
    banExpires: integer("ban_expires", { mode: "timestamp_ms" }),
    banReason: text("ban_reason", { length: 255 }),
    banned: integer("banned", { mode: "boolean" }).default(false).notNull(),
    createdAt: integer("created_at", { mode: "timestamp_ms" })
      .default(sql`(unixepoch() * 1000)`)
      .notNull(),
    email: text("email", { length: 64 }).notNull().unique(),
    emailVerified: integer("email_verified", { mode: "boolean" }).default(false).notNull(),
    id: text("id").primaryKey(),
    image: text("image", { length: 2048 }),
    name: text("name", { length: 32 }).notNull(),
    role: text("role", { enum: userRoleEnum.enumValues }).default(DEFAULT_ROLE_CODE).notNull(),
    timezone: text("timezone", { enum: userTimezoneEnum.enumValues }).default(DEFAULT_TIMEZONE_CODE).notNull(),
    twoFactorEnabled: integer("two_factor_enabled", { mode: "boolean" }).default(false).notNull(),
    updatedAt: integer("updated_at", { mode: "timestamp_ms" })
      .default(sql`(unixepoch() * 1000)`)
      .$onUpdate(
        () =>
          /* @__PURE__ */
          new Date(),
      )
      .notNull(),
  },
  (table) => [index("user_createdAt_idx").on(table.createdAt), index("user_role_createdAt_idx").on(table.role, table.createdAt)],
)

export const userRelations = relations(user, ({ many }) => ({
  accounts: many(account),
  sessions: many(session),
  twoFactors: many(twoFactor),
}))
