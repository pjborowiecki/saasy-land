import { relations, sql } from "drizzle-orm"
import { index, integer, sqliteTable, text } from "drizzle-orm/sqlite-core"

import { LICENSE_STATUS, LICENSE_TIER } from "~/src/modules/license/license.constants"
import { user } from "~/src/modules/user/user.schema"

export const licenseTierEnum = { enumValues: [LICENSE_TIER.CORE, LICENSE_TIER.COMPLETE, LICENSE_TIER.AGENCY] } as const
export const licenseStatusEnum = { enumValues: [LICENSE_STATUS.ACTIVE, LICENSE_STATUS.REVOKED] } as const

export type LicenseTier = (typeof licenseTierEnum.enumValues)[number]
export type LicenseStatus = (typeof licenseStatusEnum.enumValues)[number]

export const POLAR_ID_MAX_LENGTH = 64
export const LICENSE_KEY_MAX_LENGTH = 128

export const license = sqliteTable(
  "license",
  {
    createdAt: integer("created_at", { mode: "timestamp_ms" })
      .default(sql`(unixepoch() * 1000)`)
      .notNull(),
    id: text("id").primaryKey(),
    key: text("key", { length: LICENSE_KEY_MAX_LENGTH }).unique(),
    polarCustomerId: text("polar_customer_id", { length: POLAR_ID_MAX_LENGTH }).notNull(),
    polarLicenseKeyId: text("polar_license_key_id", { length: POLAR_ID_MAX_LENGTH }).unique(),
    polarOrderId: text("polar_order_id", { length: POLAR_ID_MAX_LENGTH }),
    status: text("status", { enum: licenseStatusEnum.enumValues }).notNull().default(LICENSE_STATUS.ACTIVE),
    tier: text("tier", { enum: licenseTierEnum.enumValues }).notNull(),
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
      .unique()
      .references(() => user.id, { onDelete: "cascade" }),
  },
  (table) => [index("license_status_tier_idx").on(table.status, table.tier)],
)

export const licenseRelations = relations(license, ({ one }) => ({
  user: one(user, { fields: [license.userId], references: [user.id] }),
}))
