"use server"

import { eq } from "drizzle-orm"

import { db } from "~/src/platform/db/client"

import { newsletterSubscriber } from "~/src/modules/newsletter-subscriber/newsletter-subscriber.schema"
import { newsletterSubscriberZodSchemas } from "~/src/modules/newsletter-subscriber/newsletter-subscriber.zod"

import { actionClient, RATE_LIMITS, withRateLimit } from "~/src/integrations/next-safe-action/action.client"

export const unsubscribeFromNewsletter = actionClient
  .use(withRateLimit("unsubscribe-from-newsletter", RATE_LIMITS.SENSITIVE))
  .inputSchema(newsletterSubscriberZodSchemas.unsubscribeFromNewsletter)
  .action(async ({ parsedInput: { token } }): Promise<{ unsubscribed: true }> => {
    await db
      .update(newsletterSubscriber)
      .set({ status: "unsubscribed", unsubscribedAt: new Date() })
      .where(eq(newsletterSubscriber.unsubscribeToken, token))

    return { unsubscribed: true }
  })
