"use server"

import { randomUUIDv7 } from "bun"
import { eq } from "drizzle-orm"

import { db } from "~/src/platform/db/client"

import { SUBSCRIPTION_RESULT } from "~/src/modules/newsletter-subscriber/newsletter-subscriber.constants"
import { newsletterSubscriber } from "~/src/modules/newsletter-subscriber/newsletter-subscriber.schema"
import { confirmationExpiry, createToken } from "~/src/modules/newsletter-subscriber/newsletter-subscriber.utils"
import { newsletterSubscriberZodSchemas } from "~/src/modules/newsletter-subscriber/newsletter-subscriber.zod"

import { actionClient, RATE_LIMITS, withRateLimit } from "~/src/integrations/next-safe-action/action.client"
import { sendEmail } from "~/src/integrations/resend/resend.utils"

import {
  NewsletterConfirmationEmail as newsletterConfirmationEmail,
  newsletterConfirmationSubject,
} from "~/src/presentation/emails/newsletter-confirmation.email-template"

const SINGLE_ROW = 1

export const subscribeToNewsletter = actionClient
  .use(withRateLimit("subscribe-to-newsletter", RATE_LIMITS.SENSITIVE))
  .inputSchema(newsletterSubscriberZodSchemas.subscribeToNewsletter)
  .outputSchema(newsletterSubscriberZodSchemas.subscribeResult)
  .action(async ({ parsedInput: { email, locale, source } }) => {
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
        id: randomUUIDv7(),
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
      react: newsletterConfirmationEmail({ confirmationToken, locale }),
      subject: newsletterConfirmationSubject(locale),
      to: address,
    })

    return { status: SUBSCRIPTION_RESULT.CONFIRMATION_SENT }
  })
