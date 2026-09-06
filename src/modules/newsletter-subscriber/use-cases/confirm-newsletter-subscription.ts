import { mutationOptions } from "@tanstack/react-query"
import { createServerFn } from "@tanstack/react-start"
import { and, eq, gt, sql } from "drizzle-orm"
import type * as zod from "zod"

import { RATE_LIMITS, withRateLimit } from "~/src/integrations/better-auth/auth.middleware"
import { db } from "~/src/integrations/drizzle-orm/drizzle.database"
import { sendEmail } from "~/src/integrations/resend/resend.utils"

import { newsletterSubscriber } from "~/src/modules/newsletter-subscriber/newsletter-subscriber.schema"
import { newsletterSubscriberZodSchemas } from "~/src/modules/newsletter-subscriber/newsletter-subscriber.zod"

import { CONTACT_EMAIL, NOTIFICATIONS_EMAIL } from "~/src/presentation/branding"
import {
  NewsletterNotificationEmail as newsletterNotificationEmail,
  newsletterNotificationSubject,
} from "~/src/presentation/emails/newsletter-notification.email-template"

export const confirmNewsletterSubscription = createServerFn({ method: "POST" })
  .middleware([withRateLimit("confirm-newsletter-subscription", RATE_LIMITS.TOKEN)])
  .validator((input: zod.input<typeof newsletterSubscriberZodSchemas.confirmNewsletterSubscription>) =>
    newsletterSubscriberZodSchemas.confirmNewsletterSubscription.parse(input),
  )
  .handler(async ({ data: { token } }) => {
    const now = new Date()

    const [confirmed] = await db
      .update(newsletterSubscriber)
      .set({
        confirmationExpiresAt: sql`null`,
        confirmationToken: sql`null`,
        status: "subscribed",
        subscribedAt: now,
        unsubscribedAt: sql`null`,
      })
      .where(and(eq(newsletterSubscriber.confirmationToken, token), gt(newsletterSubscriber.confirmationExpiresAt, now)))
      .returning({ email: newsletterSubscriber.email, locale: newsletterSubscriber.locale })

    if (!confirmed) {
      return { confirmed: false }
    }

    try {
      await sendEmail({
        from: NOTIFICATIONS_EMAIL,
        idempotencyKey: `newsletter-notification/${token}`,
        react: newsletterNotificationEmail({ email: confirmed.email, locale: confirmed.locale }),
        subject: newsletterNotificationSubject(),
        to: CONTACT_EMAIL,
      })
    } catch (error) {
      console.error(`[newsletter] owner notification failed for ${confirmed.email}`, error)
    }

    return { confirmed: true }
  })

export const confirmNewsletterSubscriptionMutation = mutationOptions({
  mutationFn: (data: Parameters<typeof confirmNewsletterSubscription>[0]["data"]) => confirmNewsletterSubscription({ data }),
  mutationKey: ["newsletter-subscriber", "confirmNewsletterSubscription"],
})
