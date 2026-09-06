import { mutationOptions } from "@tanstack/react-query"
import { createServerFn } from "@tanstack/react-start"
import { getRequest } from "@tanstack/react-start/server"
import { eq } from "drizzle-orm"
import { v7 } from "uuid"
import type * as zod from "zod"

import { RATE_LIMITS, withRateLimit } from "~/src/integrations/better-auth/auth.middleware"
import { db } from "~/src/integrations/drizzle-orm/drizzle.database"
import { sendEmail } from "~/src/integrations/resend/resend.utils"

import { SUBSCRIPTION_RESULT } from "~/src/modules/newsletter-subscriber/newsletter-subscriber.constants"
import { newsletterSubscriber } from "~/src/modules/newsletter-subscriber/newsletter-subscriber.schema"
import { newsletterRequestOrigin } from "~/src/modules/newsletter-subscriber/newsletter-subscriber.server"
import { confirmationExpiry, confirmationUrl, createToken } from "~/src/modules/newsletter-subscriber/newsletter-subscriber.utils"
import { newsletterSubscriberZodSchemas } from "~/src/modules/newsletter-subscriber/newsletter-subscriber.zod"

import {
  NewsletterConfirmationEmail as newsletterConfirmationEmail,
  newsletterConfirmationSubject,
} from "~/src/presentation/emails/newsletter-confirmation.email-template"

const SINGLE_ROW = 1

export const subscribeToNewsletter = createServerFn({ method: "POST" })
  .middleware([withRateLimit("subscribe-to-newsletter", RATE_LIMITS.SENSITIVE)])
  .validator((input: zod.input<typeof newsletterSubscriberZodSchemas.subscribeToNewsletter>) =>
    newsletterSubscriberZodSchemas.subscribeToNewsletter.parse(input),
  )
  .handler(async ({ data: { email, locale, source } }) => {
    const origin = newsletterRequestOrigin(getRequest())
    const address = email.toLowerCase()

    const [existing] = await db
      .select({ status: newsletterSubscriber.status })
      .from(newsletterSubscriber)
      .where(eq(newsletterSubscriber.email, address))
      .limit(SINGLE_ROW)

    if (existing?.status === "subscribed") {
      return { status: SUBSCRIPTION_RESULT.ALREADY_SUBSCRIBED }
    }

    const confirmationToken = createToken()

    await db
      .insert(newsletterSubscriber)
      .values({
        confirmationExpiresAt: confirmationExpiry(),
        confirmationToken,
        email: address,
        id: v7(),
        locale,
        source: source ?? "footer",
        unsubscribeToken: createToken(),
      })
      .onConflictDoUpdate({
        set: { confirmationExpiresAt: confirmationExpiry(), confirmationToken, locale, status: "pending" },
        target: newsletterSubscriber.email,
      })

    await sendEmail({
      idempotencyKey: `newsletter-confirmation/${confirmationToken}`,
      react: newsletterConfirmationEmail({ confirmUrl: confirmationUrl({ locale, origin, token: confirmationToken }), locale }),
      subject: newsletterConfirmationSubject(locale),
      to: address,
    })

    return { status: SUBSCRIPTION_RESULT.CONFIRMATION_SENT }
  })

export const subscribeToNewsletterMutation = mutationOptions({
  mutationFn: (data: Parameters<typeof subscribeToNewsletter>[0]["data"]) => subscribeToNewsletter({ data }),
  mutationKey: ["newsletter-subscriber", "subscribeToNewsletter"],
})
