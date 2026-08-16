"use server"

import { eq } from "drizzle-orm"

import { db } from "~/src/platform/db/client"

import { newsletterSubscriber } from "~/src/modules/newsletter-subscriber/newsletter-subscriber.schema"
import { newsletterSubscriberZodSchemas } from "~/src/modules/newsletter-subscriber/newsletter-subscriber.zod"

import { actionClient, withAuth } from "~/src/integrations/next-safe-action/action.client"

const SINGLE_ROW = 1

export const getNewsletterSubscription = actionClient
  .use(withAuth())
  .outputSchema(newsletterSubscriberZodSchemas.subscriptionStatus)
  .action(async ({ ctx }) => {
    const address = ctx.auth.user.email.toLowerCase()

    const [row] = await db
      .select({ status: newsletterSubscriber.status })
      .from(newsletterSubscriber)
      .where(eq(newsletterSubscriber.email, address))
      .limit(SINGLE_ROW)

    return { isSubscribed: row?.status === "subscribed" }
  })
