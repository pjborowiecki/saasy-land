"use server"

import { newsletterZodSchemas } from "~/src/modules/newsletter/newsletter.zod"

import { actionClient, RATE_LIMITS, withRateLimit } from "~/src/integrations/next-safe-action/action.client"
import { sendEmail } from "~/src/integrations/resend/resend.utils"

import { CONTACT_EMAIL } from "~/src/presentation/branding"
import {
  BuildLogConfirmationEmail as buildLogConfirmationEmail,
  buildLogConfirmationSubject,
} from "~/src/presentation/emails/build-log-confirmation.email-template"
import {
  BuildLogNotificationEmail as buildLogNotificationEmail,
  buildLogNotificationSubject,
} from "~/src/presentation/emails/build-log-notification.email-template"

/**
 * The footer's build log signup, wired without a table.
 *
 * There is no subscribers table and no new environment variable, so the list lives where
 * the owner can actually act on it: the notification to `CONTACT_EMAIL` is the record of
 * the lead, and the confirmation is the promise kept to the person who left it. The owner
 * is notified first, because a confirmation nobody logged is the worse failure of the two.
 *
 * The address keys both idempotency keys, so a double-tapped submit or a retried request
 * inside Resend's dedupe window sends one of each rather than two.
 *
 * Rate limited like any other unauthenticated public write: this endpoint sends mail on
 * behalf of an anonymous visitor, which is the shape every open relay starts out as.
 */
export const subscribeToBuildLog = actionClient
  .use(withRateLimit("subscribe-to-build-log", RATE_LIMITS.SENSITIVE))
  .inputSchema(newsletterZodSchemas.subscribeToBuildLog)
  .action(async ({ parsedInput: { email, locale } }): Promise<{ subscribed: true }> => {
    const address = email.toLowerCase()

    await sendEmail({
      idempotencyKey: `build-log-notification/${address}`,
      react: buildLogNotificationEmail({ email: address, locale }),
      subject: buildLogNotificationSubject(),
      to: CONTACT_EMAIL,
    })

    await sendEmail({
      idempotencyKey: `build-log-confirmation/${address}`,
      react: buildLogConfirmationEmail({ locale }),
      subject: buildLogConfirmationSubject(locale),
      to: address,
    })

    return { subscribed: true }
  })
