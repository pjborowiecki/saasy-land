import { index, pgEnum, pgTable, timestamp, uuid, varchar } from "drizzle-orm/pg-core"

import { I18N } from "~/src/integrations/next-intl/i18n.config"

export const newsletterStatusEnum = pgEnum("newsletter_status", ["subscribed", "unsubscribed", "pending"])

export const newsletterSourceEnum = pgEnum("newsletter_source", ["footer", "blog", "app"])
export const newsletterLocaleEnum = pgEnum("newsletter_locale", I18N.LOCALES)

export type NewsletterStatus = (typeof newsletterStatusEnum.enumValues)[number]
export type NewsletterSource = (typeof newsletterSourceEnum.enumValues)[number]

export const NEWSLETTER_TOKEN_LENGTH = 64

export const CONFIRMATION_WINDOW_IN_HOURS = 24

export const EMAIL_MAX_LENGTH = 255

export const newsletterSubscriber = pgTable(
  "newsletter_subscriber",
  {
    confirmationExpiresAt: timestamp("confirmation_expires_at", { withTimezone: true }),
    confirmationToken: varchar("confirmation_token", { length: NEWSLETTER_TOKEN_LENGTH }).unique(),
    createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
    email: varchar("email", { length: EMAIL_MAX_LENGTH }).notNull().unique(),
    id: uuid("id").primaryKey(),
    locale: newsletterLocaleEnum().notNull().default(I18N.DEFAULT_LOCALE),
    source: newsletterSourceEnum().notNull().default("footer"),
    status: newsletterStatusEnum().notNull().default("pending"),
    subscribedAt: timestamp("subscribed_at", { withTimezone: true }),
    unsubscribeToken: varchar("unsubscribe_token", { length: NEWSLETTER_TOKEN_LENGTH }).notNull().unique(),
    unsubscribedAt: timestamp("unsubscribed_at", { withTimezone: true }),
    updatedAt: timestamp("updated_at", { withTimezone: true })
      .defaultNow()
      .$onUpdate(
        () =>
          /* @__PURE__ */
          new Date(),
      )
      .notNull(),
  },
  (table) => [index("newsletter_subscriber_status_locale_idx").on(table.status, table.locale)],
)
