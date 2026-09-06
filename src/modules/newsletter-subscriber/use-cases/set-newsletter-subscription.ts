import { mutationOptions } from "@tanstack/react-query"
import { createServerFn } from "@tanstack/react-start"
import { eq, sql } from "drizzle-orm"
import { v7 } from "uuid"
import type * as zod from "zod"

import { withAuth } from "~/src/integrations/better-auth/auth.middleware"
import { db } from "~/src/integrations/drizzle-orm/drizzle.database"

import { newsletterSubscriber } from "~/src/modules/newsletter-subscriber/newsletter-subscriber.schema"
import { createToken } from "~/src/modules/newsletter-subscriber/newsletter-subscriber.utils"
import { newsletterSubscriberZodSchemas } from "~/src/modules/newsletter-subscriber/newsletter-subscriber.zod"

export const setNewsletterSubscription = createServerFn({ method: "POST" })
  .middleware([withAuth()])
  .validator((input: zod.input<typeof newsletterSubscriberZodSchemas.setNewsletterSubscription>) =>
    newsletterSubscriberZodSchemas.setNewsletterSubscription.parse(input),
  )
  .handler(async ({ context, data: { isSubscribed, locale } }) => {
    const address = context.auth.user.email.toLowerCase()

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
        id: v7(),
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

export const setNewsletterSubscriptionMutation = mutationOptions({
  mutationFn: (data: Parameters<typeof setNewsletterSubscription>[0]["data"]) => setNewsletterSubscription({ data }),
  mutationKey: ["newsletter-subscriber", "setNewsletterSubscription"],
})
