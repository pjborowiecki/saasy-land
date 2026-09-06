import { createSchemaFactory } from "drizzle-zod"
import zod from "zod/v4"

import { emailSchema } from "~/src/integrations/better-auth/auth.zod"
import { I18N } from "~/src/integrations/use-intl/i18n.config"

import { SUBSCRIPTION_RESULT } from "~/src/modules/newsletter-subscriber/newsletter-subscriber.constants"
import {
  NEWSLETTER_TOKEN_LENGTH,
  newsletterSourceEnum,
  newsletterSubscriber,
} from "~/src/modules/newsletter-subscriber/newsletter-subscriber.schema"
import { NEWSLETTER_SUBSCRIBER_VALIDATION_MESSAGE } from "~/src/modules/newsletter-subscriber/newsletter-subscriber.validations"

const { createInsertSchema, createSelectSchema, createUpdateSchema } = createSchemaFactory({ zodInstance: zod })

const localeField = zod.enum(I18N.SUPPORTED_LOCALES)

const tokenField = zod.string().length(NEWSLETTER_TOKEN_LENGTH, { message: NEWSLETTER_SUBSCRIBER_VALIDATION_MESSAGE.tokenInvalid })

const subscribeToNewsletter = zod.object({
  email: emailSchema,
  locale: localeField,
  source: zod.enum(newsletterSourceEnum.enumValues).optional(),
})

const unsubscribeFromNewsletter = zod.object({
  token: tokenField,
})

const confirmNewsletterSubscription = zod.object({
  token: tokenField,
})

const setNewsletterSubscription = zod.object({
  isSubscribed: zod.boolean(),
  locale: localeField,
})

const subscriptionStatus = zod.object({
  isSubscribed: zod.boolean(),
})

const subscribeResult = zod.object({
  status: zod.enum(SUBSCRIPTION_RESULT),
})

const confirmResult = zod.object({
  confirmed: zod.boolean(),
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
