import type { SupportedLocale } from "~/src/integrations/use-intl/i18n.config"

import deEmails from "~/messages/de-DE/emails.json"
import deNewsletter from "~/messages/de-DE/emails.newsletter.json"
import enEmails from "~/messages/en-US/emails.json"
import enNewsletter from "~/messages/en-US/emails.newsletter.json"
import esEmails from "~/messages/es-ES/emails.json"
import esNewsletter from "~/messages/es-ES/emails.newsletter.json"
import frEmails from "~/messages/fr-FR/emails.json"
import frNewsletter from "~/messages/fr-FR/emails.newsletter.json"
import itEmails from "~/messages/it-IT/emails.json"
import itNewsletter from "~/messages/it-IT/emails.newsletter.json"
import jaEmails from "~/messages/ja-JP/emails.json"
import jaNewsletter from "~/messages/ja-JP/emails.newsletter.json"
import plEmails from "~/messages/pl-PL/emails.json"
import plNewsletter from "~/messages/pl-PL/emails.newsletter.json"
import ptEmails from "~/messages/pt-BR/emails.json"
import ptNewsletter from "~/messages/pt-BR/emails.newsletter.json"
import ukEmails from "~/messages/uk-UA/emails.json"
import ukNewsletter from "~/messages/uk-UA/emails.newsletter.json"

// Email rendering is synchronous; bundle only its namespaces with the Worker.
const EMAIL_MESSAGES = {
  "de-DE": { emails: { ...deEmails, newsletter: deNewsletter } },
  "en-US": { emails: { ...enEmails, newsletter: enNewsletter } },
  "es-ES": { emails: { ...esEmails, newsletter: esNewsletter } },
  "fr-FR": { emails: { ...frEmails, newsletter: frNewsletter } },
  "it-IT": { emails: { ...itEmails, newsletter: itNewsletter } },
  "ja-JP": { emails: { ...jaEmails, newsletter: jaNewsletter } },
  "pl-PL": { emails: { ...plEmails, newsletter: plNewsletter } },
  "pt-BR": { emails: { ...ptEmails, newsletter: ptNewsletter } },
  "uk-UA": { emails: { ...ukEmails, newsletter: ukNewsletter } },
} as const satisfies Record<SupportedLocale, unknown>

export const getEmailMessages = (locale: SupportedLocale) => EMAIL_MESSAGES[locale]
