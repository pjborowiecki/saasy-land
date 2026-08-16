import { createSchemaFactory } from "drizzle-zod"
import { z } from "zod/v4"

import { SUBSCRIPTION_RESULT } from "~/src/modules/newsletter-subscriber/newsletter-subscriber.constants"
import {
  NEWSLETTER_TOKEN_LENGTH,
  newsletterSourceEnum,
  newsletterSubscriber,
} from "~/src/modules/newsletter-subscriber/newsletter-subscriber.schema"
import { NEWSLETTER_SUBSCRIBER_VALIDATION_MESSAGE } from "~/src/modules/newsletter-subscriber/newsletter-subscriber.validations"

import { emailSchema } from "~/src/integrations/better-auth/auth.zod"
import { I18N } from "~/src/integrations/next-intl/i18n.config"

const { createInsertSchema, createSelectSchema, createUpdateSchema } = createSchemaFactory({ zodInstance: z })

const localeField = z.enum(I18N.LOCALES)

const tokenField = z.string().length(NEWSLETTER_TOKEN_LENGTH, { message: NEWSLETTER_SUBSCRIBER_VALIDATION_MESSAGE.tokenInvalid })

const subscribeToNewsletter = z.object({
  email: emailSchema,
  locale: localeField,
  source: z.enum(newsletterSourceEnum.enumValues).optional(),
})

const unsubscribeFromNewsletter = z.object({
  token: tokenField,
})

const confirmNewsletterSubscription = z.object({
  token: tokenField,
})

const setNewsletterSubscription = z.object({
  isSubscribed: z.boolean(),
  locale: localeField,
})

const subscriptionStatus = z.object({
  isSubscribed: z.boolean(),
})

const subscribeResult = z.object({
  status: z.enum(SUBSCRIPTION_RESULT),
})

const confirmResult = z.object({
  confirmed: z.boolean(),
})

const insert = createInsertSchema(newsletterSubscriber)
const select = createSelectSchema(newsletterSubscriber)
const update = createUpdateSchema(newsletterSubscriber)

export const newsletterSubscriberZodSchemas = {
  confirmNewsletterSubscription,
  confirmResult,
  insert,
  select,
  setNewsletterSubscription,
  subscribeResult,
  subscribeToNewsletter,
  subscriptionStatus,
  unsubscribeFromNewsletter,
  update,
}
