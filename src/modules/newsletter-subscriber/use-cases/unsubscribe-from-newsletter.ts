import { createServerFn } from "@tanstack/react-start"
import { eq } from "drizzle-orm"
import type * as zod from "zod"

import { RATE_LIMITS, withRateLimit } from "~/src/integrations/better-auth/auth.middleware"
import { db } from "~/src/integrations/drizzle-orm/drizzle.database"

import { newsletterSubscriber } from "~/src/modules/newsletter-subscriber/newsletter-subscriber.schema"
import { newsletterSubscriberZodSchemas } from "~/src/modules/newsletter-subscriber/newsletter-subscriber.zod"

export const unsubscribeFromNewsletter = createServerFn({ method: "POST" })
  .middleware([withRateLimit("unsubscribe-from-newsletter", RATE_LIMITS.SENSITIVE)])
  .validator((input: zod.input<typeof newsletterSubscriberZodSchemas.unsubscribeFromNewsletter>) =>
    newsletterSubscriberZodSchemas.unsubscribeFromNewsletter.parse(input),
  )
  .handler(async ({ data: { token } }): Promise<{ unsubscribed: true }> => {
    await db
      .update(newsletterSubscriber)
      .set({ status: "unsubscribed", unsubscribedAt: new Date() })
      .where(eq(newsletterSubscriber.unsubscribeToken, token))

    return { unsubscribed: true }
  })
