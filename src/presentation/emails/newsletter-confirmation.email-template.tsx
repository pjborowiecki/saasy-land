import type { JSX } from "react"

import { createTranslator } from "next-intl"
import { Body, Button, Container, Head, Heading, Html, pixelBasedPreset, Preview, Tailwind, Text } from "react-email"

import { NEWSLETTER_TOKEN_LENGTH } from "~/src/modules/newsletter-subscriber/newsletter-subscriber.schema"
import { confirmationUrl } from "~/src/modules/newsletter-subscriber/newsletter-subscriber.utils"

import { I18N, type Locale } from "~/src/integrations/next-intl/i18n.config"
import { loadLocaleMessagesFromDir } from "~/src/integrations/next-intl/i18n.utils"

import { CONTACT_EMAIL } from "~/src/presentation/branding"

const TAILWIND_CONFIG = { presets: [pixelBasedPreset] }

export function newsletterConfirmationSubject(locale: Locale): string {
  return createTranslator({ locale, messages: loadLocaleMessagesFromDir(locale), namespace: "emails.newsletter.confirmation" })("subject")
}

interface NewsletterConfirmationEmailProps {
  readonly confirmationToken: string
  readonly locale: Locale
}

export function NewsletterConfirmationEmail({ confirmationToken, locale }: Readonly<NewsletterConfirmationEmailProps>): JSX.Element {
  const t = createTranslator({ locale, messages: loadLocaleMessagesFromDir(locale), namespace: "emails.newsletter.confirmation" })
  const confirmUrl = confirmationUrl(locale, confirmationToken)

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
  confirmationToken: "0".repeat(NEWSLETTER_TOKEN_LENGTH),
  locale: I18N.DEFAULT_LOCALE,
} satisfies NewsletterConfirmationEmailProps
