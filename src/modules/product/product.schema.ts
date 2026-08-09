import { index, integer, pgEnum, pgTable, text, timestamp, uuid, varchar } from "drizzle-orm/pg-core"

import { DEFAULT_CURRENCY_CODE } from "~/src/modules/_core/constants/currency"

export const productStatusEnum = pgEnum("product_status", ["draft", "published", "archived"])
export const productTypeEnum = pgEnum("product_type", ["one_time", "subscription", "course"])

export type ProductStatus = (typeof productStatusEnum.enumValues)[number]
export type ProductType = (typeof productTypeEnum.enumValues)[number]

export const product = pgTable(
  "product",
  {
    billingCycle: varchar("billing_cycle", { length: 32 }),
    createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
    currency: varchar("currency", { length: 3 }).notNull().default(DEFAULT_CURRENCY_CODE),
    description: text("description").notNull().default(""),
    id: uuid("id").primaryKey(),
    name: varchar("name", { length: 255 }).notNull(),
    priceCents: integer("price_cents").notNull().default(0),
    status: productStatusEnum().notNull().default("draft"),
    type: productTypeEnum().notNull().default("one_time"),
    updatedAt: timestamp("updated_at", { withTimezone: true })
      .defaultNow()
      .$onUpdate(
        () =>
          /* @__PURE__ */
          new Date(),
      )
      .notNull(),
  },
  (table) => [index("product_createdAt_idx").on(table.createdAt)],
)
