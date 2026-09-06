import type { JSX } from "react"

import { Body, Button, Container, Head, Heading, Html, Preview, Tailwind, Text, pixelBasedPreset } from "react-email"
import { createTranslator } from "use-intl"

import { I18N, type Locale } from "~/src/integrations/use-intl/i18n.config"
import { getEmailMessages } from "~/src/integrations/use-intl/i18n.emails"

import { NEWSLETTER_TOKEN_LENGTH } from "~/src/modules/newsletter-subscriber/newsletter-subscriber.schema"
import { confirmationUrl } from "~/src/modules/newsletter-subscriber/newsletter-subscriber.utils"

import { APP_URL, CONTACT_EMAIL } from "~/src/presentation/branding"

const TAILWIND_CONFIG = { presets: [pixelBasedPreset] }

export const newsletterConfirmationSubject = (locale: Locale): string =>
  createTranslator({ locale, messages: getEmailMessages(locale), namespace: "emails.newsletter.confirmation" })("subject")

interface NewsletterConfirmationEmailProps {
  readonly confirmUrl: string
  readonly locale: Locale
}

export const NewsletterConfirmationEmail = ({ confirmUrl, locale }: Readonly<NewsletterConfirmationEmailProps>): JSX.Element => {
  const t = createTranslator({ locale, messages: getEmailMessages(locale), namespace: "emails.newsletter.confirmation" })

  return (
    <Html lang={locale}>
      <Tailwind config={TAILWIND_CONFIG}>
        <Head />
        <Body className="font-sans">
          <Preview>{t("preview")}</Preview>
          <Container className="mx-auto px-5 py-10">
            <Heading className="m-0 mb-4 text-2xl font-bold">{t("heading")}</Heading>
            <Text className="m-0 mb-6 text-base text-neutral-600">{t("body")}</Text>
            <Button
              href={confirmUrl}
              className="box-border rounded-md bg-neutral-900 px-5 py-3 text-center text-base text-white no-underline"
            >
              {t("button")}
            </Button>
            <Text className="mt-6 text-sm text-neutral-500">{t("footer")}</Text>
            <Text className="m-0 text-sm text-neutral-500">
              <a className="text-neutral-500 underline" href={`mailto:${CONTACT_EMAIL}`}>
                {CONTACT_EMAIL}
              </a>
            </Text>
          </Container>
        </Body>
      </Tailwind>
    </Html>
  )
}

NewsletterConfirmationEmail.PreviewProps = {
  confirmUrl: confirmationUrl({ locale: I18N.DEFAULT_LOCALE, origin: APP_URL, token: "0".repeat(NEWSLETTER_TOKEN_LENGTH) }),
  locale: I18N.DEFAULT_LOCALE,
} satisfies NewsletterConfirmationEmailProps
