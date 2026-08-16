"use server"

import { and, eq, gt, sql } from "drizzle-orm"

import { db } from "~/src/platform/db/client"

import { newsletterSubscriber } from "~/src/modules/newsletter-subscriber/newsletter-subscriber.schema"
import { newsletterSubscriberZodSchemas } from "~/src/modules/newsletter-subscriber/newsletter-subscriber.zod"

import { actionClient, RATE_LIMITS, withRateLimit } from "~/src/integrations/next-safe-action/action.client"
import { sendEmail } from "~/src/integrations/resend/resend.utils"

import { CONTACT_EMAIL, NOTIFICATIONS_EMAIL } from "~/src/presentation/branding"
import {
  NewsletterNotificationEmail as newsletterNotificationEmail,
  newsletterNotificationSubject,
} from "~/src/presentation/emails/newsletter-notification.email-template"

export const confirmNewsletterSubscription = actionClient
  .use(withRateLimit("confirm-newsletter-subscription", RATE_LIMITS.TOKEN))
  .inputSchema(newsletterSubscriberZodSchemas.confirmNewsletterSubscription)
  .outputSchema(newsletterSubscriberZodSchemas.confirmResult)
  .action(async ({ parsedInput: { token } }) => {
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
