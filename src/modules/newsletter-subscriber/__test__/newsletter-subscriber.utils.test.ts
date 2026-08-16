import { env } from "~/src/platform/env"

import { CONFIRMATION_WINDOW_IN_HOURS, NEWSLETTER_TOKEN_LENGTH } from "~/src/modules/newsletter-subscriber/newsletter-subscriber.schema"
import {
  confirmationExpiry,
  confirmationUrl,
  createToken,
  unsubscribeUrl,
} from "~/src/modules/newsletter-subscriber/newsletter-subscriber.utils"

import { I18N } from "~/src/integrations/next-intl/i18n.config"
import { localePathPrefixes } from "~/src/integrations/next-intl/i18n.routing"

import { ROUTES } from "~/src/routes"

const SAMPLE_SIZE = 50
const TOKEN = "e".repeat(NEWSLETTER_TOKEN_LENGTH)
const MILLISECONDS_PER_HOUR = 3_600_000
const TOLERANCE_IN_MILLISECONDS = 1000

describe("newsletter-subscriber.utils", () => {
  it("returns lowercase hex of the length the column accepts", () => {
    expect.hasAssertions()

    const token = createToken()

    expect(token).toHaveLength(NEWSLETTER_TOKEN_LENGTH)
    expect(token).toMatch(/^[\da-f]+$/u)
  })

  it("does not repeat itself", () => {
    expect.hasAssertions()

    const tokens = new Set(Array.from({ length: SAMPLE_SIZE }, () => createToken()))

    expect(tokens.size).toBe(SAMPLE_SIZE)
  })

  it("expires a confirmation a day out", () => {
    expect.hasAssertions()

    const expiry = confirmationExpiry().getTime() - Date.now()

    expect(expiry).toBeCloseTo(CONFIRMATION_WINDOW_IN_HOURS * MILLISECONDS_PER_HOUR, -Math.log10(TOLERANCE_IN_MILLISECONDS))
  })

  it("points both token links at this deployment", () => {
    expect.hasAssertions()

    expect(confirmationUrl(I18N.DEFAULT_LOCALE, TOKEN)).toBe(`${env.NEXT_PUBLIC_APP_URL}${ROUTES.NEWSLETTER_CONFIRM}?token=${TOKEN}`)
    expect(unsubscribeUrl(I18N.DEFAULT_LOCALE, TOKEN)).toBe(`${env.NEXT_PUBLIC_APP_URL}${ROUTES.NEWSLETTER_UNSUBSCRIBE}?token=${TOKEN}`)
  })

  it("keeps a subscriber in the language they signed up in", () => {
    expect.hasAssertions()

    expect(confirmationUrl("pl-PL", TOKEN)).toContain(`${localePathPrefixes["pl-PL"]}${ROUTES.NEWSLETTER_CONFIRM}`)
    expect(unsubscribeUrl("pl-PL", TOKEN)).toContain(`${localePathPrefixes["pl-PL"]}${ROUTES.NEWSLETTER_UNSUBSCRIBE}`)
  })
})
