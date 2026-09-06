import { describe, expect, it } from "vite-plus/test"

import { I18N } from "~/src/integrations/use-intl/i18n.config"

import { CONFIRMATION_WINDOW_IN_HOURS, NEWSLETTER_TOKEN_LENGTH } from "~/src/modules/newsletter-subscriber/newsletter-subscriber.schema"
import {
  confirmationExpiry,
  confirmationUrl,
  createToken,
  unsubscribeUrl,
} from "~/src/modules/newsletter-subscriber/newsletter-subscriber.utils"

import { APP_URL } from "~/src/presentation/branding"
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

    const options = { locale: I18N.DEFAULT_LOCALE, origin: APP_URL, token: TOKEN }
    expect(confirmationUrl(options)).toBe(`${APP_URL}${ROUTES.NEWSLETTER_CONFIRM}?token=${TOKEN}`)
    expect(unsubscribeUrl(options)).toBe(`${APP_URL}${ROUTES.NEWSLETTER_UNSUBSCRIBE}?token=${TOKEN}`)
  })

  it("keeps a subscriber in the language they signed up in", () => {
    expect.hasAssertions()

    expect(confirmationUrl({ locale: "pl-PL", origin: APP_URL, token: TOKEN })).toContain(`/pl-PL${ROUTES.NEWSLETTER_CONFIRM}`)
    expect(unsubscribeUrl({ locale: "pl-PL", origin: APP_URL, token: TOKEN })).toContain(`/pl-PL${ROUTES.NEWSLETTER_UNSUBSCRIBE}`)
  })

  it.each(["http://localhost:3000", "http://127.0.0.1:3020", "https://preview.saasyland.com", APP_URL])(
    "keeps newsletter action links on their originating deployment: %s",
    (origin) => {
      const options = { locale: "fr-FR" as const, origin, token: TOKEN }
      expect(confirmationUrl(options)).toBe(`${origin}/fr-FR${ROUTES.NEWSLETTER_CONFIRM}?token=${TOKEN}`)
      expect(unsubscribeUrl(options)).toBe(`${origin}/fr-FR${ROUTES.NEWSLETTER_UNSUBSCRIBE}?token=${TOKEN}`)
    },
  )

  it("encodes tokens as a single query parameter", () => {
    const token = "a&next=https://example.test/#part"
    const url = new URL(confirmationUrl({ locale: "en-US", origin: APP_URL, token }))
    expect(url.searchParams.get("token")).toBe(token)
    expect([...url.searchParams.keys()]).toStrictEqual(["token"])
    expect(url.hash).toBe("")
  })
})
