import type { NewsletterSubscriberValidationMessageKey } from "~/src/integrations/use-intl/i18n.types"

export const NEWSLETTER_SUBSCRIBER_VALIDATION_MESSAGE = {
  emailRequired: "emailRequired",
  tokenInvalid: "tokenInvalid",
} as const satisfies Record<string, NewsletterSubscriberValidationMessageKey>
