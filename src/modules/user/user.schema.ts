import { relations } from "drizzle-orm"
import { boolean, index, pgEnum, pgTable, timestamp, uuid, varchar } from "drizzle-orm/pg-core"

import { TIMEZONE_CODES, Timezone } from "~/src/modules/_core/constants/timezone"
import { account } from "~/src/modules/account/account.schema"
import { session } from "~/src/modules/session/session.schema"
import { twoFactor } from "~/src/modules/two-factor/two-factor.schema"

import { DEFAULT_ROLE, ROLE_VALUES } from "~/src/integrations/better-auth/auth.access"

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
    isAnonymous: boolean("is_anonymous").default(false).notNull(),
    name: varchar("name", { length: 32 }).notNull(),
    role: userRoleEnum().default(DEFAULT_ROLE).notNull(),
    timezone: userTimezoneEnum().default(Timezone.DEFAULT_CODE).notNull(),
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
