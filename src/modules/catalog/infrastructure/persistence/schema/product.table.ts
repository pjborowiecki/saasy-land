import { integer, pgEnum, pgTable, text, timestamp, uuid, varchar } from "drizzle-orm/pg-core"

import { Currency } from "~/src/modules/shared-kernel/domain/value-objects/currency"

export const productStatusEnum = pgEnum("product_status", ["draft", "published", "archived"])
export const productTypeEnum = pgEnum("product_type", ["one_time", "subscription", "course"])

/** Drizzle `$onUpdate` callback — extracted for coverage / stable identity. */
export function productUpdatedAtNow(): Date {
  return new Date()
}

export const product = pgTable("product", {
  billingCycle: varchar("billing_cycle", { length: 32 }),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
  currency: varchar("currency", { length: 3 }).notNull().default(Currency.DEFAULT_CODE),
  description: text("description").notNull().default(""),
  id: uuid("id").primaryKey(),
  name: varchar("name", { length: 255 }).notNull(),
  priceCents: integer("price_cents").notNull().default(0),
  status: productStatusEnum().notNull().default("draft"),
  type: productTypeEnum().notNull().default("one_time"),
  updatedAt: timestamp("updated_at", { withTimezone: true }).defaultNow().$onUpdate(productUpdatedAtNow).notNull(),
})

export type ProductRow = typeof product.$inferSelect
export type ProductInsert = typeof product.$inferInsert
