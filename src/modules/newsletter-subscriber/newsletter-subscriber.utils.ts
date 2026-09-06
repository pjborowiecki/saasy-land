import type { Locale } from "~/src/integrations/use-intl/i18n.config"
import { localizePathname } from "~/src/integrations/use-intl/i18n.paths"

import { CONFIRMATION_WINDOW_IN_HOURS, NEWSLETTER_TOKEN_LENGTH } from "~/src/modules/newsletter-subscriber/newsletter-subscriber.schema"

import { ROUTES } from "~/src/routes"

const HEX_CHARS_PER_BYTE = 2
const HEX_RADIX = 16
const MILLISECONDS_PER_HOUR = 3_600_000

const HEX_BYTES = NEWSLETTER_TOKEN_LENGTH / HEX_CHARS_PER_BYTE

export const createToken = (): string => {
  const bytes = crypto.getRandomValues(new Uint8Array(HEX_BYTES))
  return [...bytes].map((byte) => byte.toString(HEX_RADIX).padStart(HEX_CHARS_PER_BYTE, "0")).join("")
}

export const confirmationExpiry = (): Date => new Date(Date.now() + CONFIRMATION_WINDOW_IN_HOURS * MILLISECONDS_PER_HOUR)

interface NewsletterTokenUrlOptions {
  readonly locale: Locale
  readonly origin: string
  readonly token: string
}

const newsletterTokenUrl = (pathname: string, { locale, origin, token }: NewsletterTokenUrlOptions): string => {
  const url = new URL(localizePathname({ locale, pathname }), origin)
  url.searchParams.set("token", token)
  return url.toString()
}

export const confirmationUrl = (options: NewsletterTokenUrlOptions): string => newsletterTokenUrl(ROUTES.NEWSLETTER_CONFIRM, options)

export const unsubscribeUrl = (options: NewsletterTokenUrlOptions): string => newsletterTokenUrl(ROUTES.NEWSLETTER_UNSUBSCRIBE, options)
