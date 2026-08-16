import type { newsletterSubscriber } from "~/src/modules/newsletter-subscriber/newsletter-subscriber.schema"

export interface NewsletterSubscriber {
  select: typeof newsletterSubscriber.$inferSelect
  insert: typeof newsletterSubscriber.$inferInsert
}
