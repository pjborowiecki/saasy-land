import type { JSX } from "react"

import { Body, Container, Head, Heading, Html, Preview, Section, Tailwind, Text, pixelBasedPreset } from "react-email"
import { createTranslator } from "use-intl"

import { I18N, type Locale } from "~/src/integrations/use-intl/i18n.config"
import { getEmailMessages } from "~/src/integrations/use-intl/i18n.emails"

const TAILWIND_CONFIG = { presets: [pixelBasedPreset] }

export const newsletterNotificationSubject = (): string =>
  createTranslator({
    locale: I18N.DEFAULT_LOCALE,
    messages: getEmailMessages(I18N.DEFAULT_LOCALE),
    namespace: "emails.newsletter.notification",
  })("subject")

interface NewsletterNotificationEmailProps {
  readonly email: string
  readonly locale: Locale
}

export const NewsletterNotificationEmail = ({ email, locale }: Readonly<NewsletterNotificationEmailProps>): JSX.Element => {
  const t = createTranslator({
    locale: I18N.DEFAULT_LOCALE,
    messages: getEmailMessages(I18N.DEFAULT_LOCALE),
    namespace: "emails.newsletter.notification",
  })

  return (
    <Html lang={I18N.DEFAULT_LOCALE}>
      <Tailwind config={TAILWIND_CONFIG}>
        <Head />
        <Body className="font-sans">
          <Preview>{t("preview")}</Preview>
          <Container className="mx-auto px-5 py-10">
            <Section>
              <Heading className="m-0 mb-4 text-2xl font-bold">{t("heading")}</Heading>
              <Text className="m-0 text-base text-neutral-600">{t("body", { email, locale })}</Text>
            </Section>
          </Container>
        </Body>
      </Tailwind>
    </Html>
  )
}

NewsletterNotificationEmail.PreviewProps = {
  email: "ada@example.com",
  locale: I18N.DEFAULT_LOCALE,
} satisfies NewsletterNotificationEmailProps
