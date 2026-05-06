import { relations } from "drizzle-orm"
import { boolean, pgTable, timestamp, uuid, varchar } from "drizzle-orm/pg-core"

import { account } from "~/src/modules/account/account.schema"
import { session } from "~/src/modules/session/session.schema"

export const user = pgTable("user", {
  id: uuid("id").primaryKey(),
  name: varchar("name", { length: 32 }).notNull(),
  email: varchar("email", { length: 64 }).notNull().unique(),
  emailVerified: boolean("email_verified").default(false).notNull(),
  image: varchar("image", { length: 2048 }),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
  updatedAt: timestamp("updated_at", { withTimezone: true })
    .defaultNow()
    .$onUpdate(() => /* @__PURE__ */ new Date())
    .notNull(),
})

export const userRelations = relations(user, ({ many }) => ({
  sessions: many(session),
  accounts: many(account),
}))
