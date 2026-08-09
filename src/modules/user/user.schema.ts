import { relations } from "drizzle-orm"
import { boolean, index, pgEnum, pgTable, timestamp, uuid, varchar } from "drizzle-orm/pg-core"

import { DEFAULT_TIMEZONE_CODE, TIMEZONE_CODES } from "~/src/modules/_core/constants/timezone"
import { account } from "~/src/modules/account/account.schema"
import { session } from "~/src/modules/session/session.schema"
import { twoFactor } from "~/src/modules/two-factor/two-factor.schema"

import { DEFAULT_ROLE_CODE, ROLE_VALUES } from "~/src/integrations/better-auth/auth.access"

export const userRoleEnum = pgEnum("user_role", ROLE_VALUES)
export const userTimezoneEnum = pgEnum("user_timezone", TIMEZONE_CODES)

export const user = pgTable(
  "user",
  {
    banExpires: timestamp("ban_expires", { withTimezone: true }),
    banReason: varchar("ban_reason", { length: 255 }),
    banned: boolean("banned").default(false).notNull(),
    createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
    email: varchar("email", { length: 64 }).notNull().unique(),
    emailVerified: boolean("email_verified").default(false).notNull(),
    id: uuid("id").primaryKey(),
    image: varchar("image", { length: 2048 }),
    name: varchar("name", { length: 32 }).notNull(),
    role: userRoleEnum().default(DEFAULT_ROLE_CODE).notNull(),
    timezone: userTimezoneEnum().default(DEFAULT_TIMEZONE_CODE).notNull(),
    twoFactorEnabled: boolean("two_factor_enabled").default(false).notNull(),
    updatedAt: timestamp("updated_at", { withTimezone: true })
      .defaultNow()
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
