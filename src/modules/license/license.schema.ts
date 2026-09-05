import { relations } from "drizzle-orm"
import { index, pgEnum, pgTable, timestamp, uuid, varchar } from "drizzle-orm/pg-core"

import { LICENSE_STATUS, LICENSE_TIER } from "~/src/modules/license/license.constants"
import { user } from "~/src/modules/user/user.schema"

export const licenseTierEnum = pgEnum("license_tier", [LICENSE_TIER.CORE, LICENSE_TIER.COMPLETE])
export const licenseStatusEnum = pgEnum("license_status", [LICENSE_STATUS.ACTIVE, LICENSE_STATUS.REVOKED])

export type LicenseTier = (typeof licenseTierEnum.enumValues)[number]
export type LicenseStatus = (typeof licenseStatusEnum.enumValues)[number]

export const POLAR_ID_MAX_LENGTH = 64
export const LICENSE_KEY_MAX_LENGTH = 128

export const license = pgTable(
  "license",
  {
    createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
    id: uuid("id").primaryKey(),
    key: varchar("key", { length: LICENSE_KEY_MAX_LENGTH }).unique(),
    polarCustomerId: varchar("polar_customer_id", { length: POLAR_ID_MAX_LENGTH }).notNull(),
    polarLicenseKeyId: varchar("polar_license_key_id", { length: POLAR_ID_MAX_LENGTH }).unique(),
    polarOrderId: varchar("polar_order_id", { length: POLAR_ID_MAX_LENGTH }),
    status: licenseStatusEnum().notNull().default(LICENSE_STATUS.ACTIVE),
    tier: licenseTierEnum().notNull(),
    updatedAt: timestamp("updated_at", { withTimezone: true })
      .defaultNow()
      .$onUpdate(
        () =>
          /* @__PURE__ */
          new Date(),
      )
      .notNull(),
    userId: uuid("user_id")
      .notNull()
      .unique()
      .references(() => user.id, { onDelete: "cascade" }),
  },
  (table) => [index("license_status_tier_idx").on(table.status, table.tier)],
)

export const licenseRelations = relations(license, ({ one }) => ({
  user: one(user, { fields: [license.userId], references: [user.id] }),
}))
