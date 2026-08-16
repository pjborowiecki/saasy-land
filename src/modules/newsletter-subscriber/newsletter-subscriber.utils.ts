import { env } from "~/src/platform/env"

import { CONFIRMATION_WINDOW_IN_HOURS, NEWSLETTER_TOKEN_LENGTH } from "~/src/modules/newsletter-subscriber/newsletter-subscriber.schema"

import type { Locale } from "~/src/integrations/next-intl/i18n.config"
import { getPathname } from "~/src/integrations/next-intl/i18n.navigation"

import { ROUTES } from "~/src/routes"

const HEX_CHARS_PER_BYTE = 2
const HEX_RADIX = 16
const MILLISECONDS_PER_HOUR = 3_600_000

const HEX_BYTES = NEWSLETTER_TOKEN_LENGTH / HEX_CHARS_PER_BYTE

export function createToken(): string {
  const bytes = crypto.getRandomValues(new Uint8Array(HEX_BYTES))
  return [...bytes].map((byte) => byte.toString(HEX_RADIX).padStart(HEX_CHARS_PER_BYTE, "0")).join("")
}

export function confirmationExpiry(): Date {
  return new Date(Date.now() + CONFIRMATION_WINDOW_IN_HOURS * MILLISECONDS_PER_HOUR)
}

export function confirmationUrl(locale: Locale, token: string): string {
  return new URL(`${getPathname({ href: ROUTES.NEWSLETTER_CONFIRM, locale })}?token=${token}`, env.NEXT_PUBLIC_APP_URL).toString()
}

export function unsubscribeUrl(locale: Locale, token: string): string {
  return new URL(`${getPathname({ href: ROUTES.NEWSLETTER_UNSUBSCRIBE, locale })}?token=${token}`, env.NEXT_PUBLIC_APP_URL).toString()
}
