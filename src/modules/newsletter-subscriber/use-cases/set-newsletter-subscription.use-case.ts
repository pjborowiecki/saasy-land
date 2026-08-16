"use server"

import { randomUUIDv7 } from "bun"
import { eq, sql } from "drizzle-orm"

import { db } from "~/src/platform/db/client"

import { newsletterSubscriber } from "~/src/modules/newsletter-subscriber/newsletter-subscriber.schema"
import { createToken } from "~/src/modules/newsletter-subscriber/newsletter-subscriber.utils"
import { newsletterSubscriberZodSchemas } from "~/src/modules/newsletter-subscriber/newsletter-subscriber.zod"

import { actionClient, withAuth } from "~/src/integrations/next-safe-action/action.client"

export const setNewsletterSubscription = actionClient
  .use(withAuth())
  .inputSchema(newsletterSubscriberZodSchemas.setNewsletterSubscription)
  .outputSchema(newsletterSubscriberZodSchemas.subscriptionStatus)
  .action(async ({ ctx, parsedInput: { isSubscribed, locale } }) => {
    const address = ctx.auth.user.email.toLowerCase()

    if (!isSubscribed) {
      await db
        .update(newsletterSubscriber)
        .set({ status: "unsubscribed", unsubscribedAt: new Date() })
        .where(eq(newsletterSubscriber.email, address))

      return { isSubscribed: false }
    }

    await db
      .insert(newsletterSubscriber)
      .values({
        email: address,
        id: randomUUIDv7(),
        locale,
        source: "app",
        status: "subscribed",
        subscribedAt: new Date(),
        unsubscribeToken: createToken(),
      })
      .onConflictDoUpdate({
        set: {
          confirmationExpiresAt: sql`null`,
          confirmationToken: sql`null`,
          locale,
          status: "subscribed",
          subscribedAt: new Date(),
          unsubscribedAt: sql`null`,
        },
        target: newsletterSubscriber.email,
      })

    return { isSubscribed: true }
  })
