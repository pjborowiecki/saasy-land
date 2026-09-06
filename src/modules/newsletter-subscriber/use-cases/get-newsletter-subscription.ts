import { queryOptions } from "@tanstack/react-query"
import { createServerFn } from "@tanstack/react-start"
import { eq } from "drizzle-orm"

import { withAuth } from "~/src/integrations/better-auth/auth.middleware"
import { db } from "~/src/integrations/drizzle-orm/drizzle.database"

import { newsletterSubscriber } from "~/src/modules/newsletter-subscriber/newsletter-subscriber.schema"

const SINGLE_ROW = 1

export const getNewsletterSubscription = createServerFn({ method: "GET" })
  .middleware([withAuth()])
  .handler(async ({ context }) => {
    const address = context.auth.user.email.toLowerCase()

    const [row] = await db
      .select({ status: newsletterSubscriber.status })
      .from(newsletterSubscriber)
      .where(eq(newsletterSubscriber.email, address))
      .limit(SINGLE_ROW)

    return { isSubscribed: row?.status === "subscribed" }
  })

export const getNewsletterSubscriptionQuery = queryOptions({
  queryFn: () => getNewsletterSubscription(),
  queryKey: ["newsletter-subscriber", "getNewsletterSubscription"],
})
