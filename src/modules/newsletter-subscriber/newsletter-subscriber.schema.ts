import { sql } from "drizzle-orm"
import { index, integer, sqliteTable, text } from "drizzle-orm/sqlite-core"

import { I18N } from "~/src/integrations/use-intl/i18n.config"

export const newsletterStatusEnum = { enumValues: ["subscribed", "unsubscribed", "pending"] } as const

export const newsletterSourceEnum = { enumValues: ["footer", "blog", "app"] } as const
export const newsletterLocaleEnum = { enumValues: I18N.SUPPORTED_LOCALES } as const

export const NEWSLETTER_TOKEN_LENGTH = 64

export const CONFIRMATION_WINDOW_IN_HOURS = 24

export const EMAIL_MAX_LENGTH = 255

export const newsletterSubscriber = sqliteTable(
  "newsletter_subscriber",
  {
    confirmationExpiresAt: integer("confirmation_expires_at", { mode: "timestamp_ms" }),
    confirmationToken: text("confirmation_token", { length: NEWSLETTER_TOKEN_LENGTH }).unique(),
    createdAt: integer("created_at", { mode: "timestamp_ms" })
      .default(sql`(unixepoch() * 1000)`)
      .notNull(),
    email: text("email", { length: EMAIL_MAX_LENGTH }).notNull().unique(),
    id: text("id").primaryKey(),
    locale: text("locale", { enum: newsletterLocaleEnum.enumValues }).notNull().default(I18N.DEFAULT_LOCALE),
    source: text("source", { enum: newsletterSourceEnum.enumValues }).notNull().default("footer"),
    status: text("status", { enum: newsletterStatusEnum.enumValues }).notNull().default("pending"),
    subscribedAt: integer("subscribed_at", { mode: "timestamp_ms" }),
    unsubscribeToken: text("unsubscribe_token", { length: NEWSLETTER_TOKEN_LENGTH }).notNull().unique(),
    unsubscribedAt: integer("unsubscribed_at", { mode: "timestamp_ms" }),
    updatedAt: integer("updated_at", { mode: "timestamp_ms" })
      .default(sql`(unixepoch() * 1000)`)
      .$onUpdate(
        () =>
          /* @__PURE__ */
          new Date(),
      )
      .notNull(),
  },
  (table) => [index("newsletter_subscriber_status_locale_idx").on(table.status, table.locale)],
)
