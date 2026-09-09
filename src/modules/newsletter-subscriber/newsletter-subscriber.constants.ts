export const SUBSCRIPTION_RESULT = {
  ALREADY_SUBSCRIBED: "alreadySubscribed",
  CONFIRMATION_SENT: "confirmationSent",
} as const

export const NEWSLETTER_SUBSCRIBER_QUERY_KEYS = {
  ALL: ["newsletter-subscriber"],
  SUBSCRIPTION: ["newsletter-subscriber", "getNewsletterSubscription"],
} as const

export const NEWSLETTER_SUBSCRIBER_MUTATION_KEYS = {
  SET_SUBSCRIPTION: ["newsletter-subscriber", "setNewsletterSubscription"],
  SUBSCRIBE: ["newsletter-subscriber", "subscribeToNewsletter"],
} as const
