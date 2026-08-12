import type { JSX } from "react"

import { createTranslator } from "next-intl"
import { Body, Container, Head, Heading, Html, pixelBasedPreset, Preview, Section, Tailwind, Text } from "react-email"

import { I18N, type Locale } from "~/src/integrations/next-intl/i18n.config"
import { loadLocaleMessagesFromDir } from "~/src/integrations/next-intl/i18n.utils"

const NAMESPACE = "emails.buildLog.notification"
const TAILWIND_CONFIG = { presets: [pixelBasedPreset] }

/**
 * Always the default locale. This one goes to the owner, not to the visitor, so it is
 * rendered in the owner's language and carries the visitor's locale as a fact instead.
 */
function translator() {
  return createTranslator({
    locale: I18N.DEFAULT_LOCALE,
    messages: loadLocaleMessagesFromDir(I18N.DEFAULT_LOCALE),
    namespace: NAMESPACE,
  })
}

export function buildLogNotificationSubject(): string {
  return translator()("subject")
}

interface BuildLogNotificationEmailProps {
  readonly email: string
  readonly locale: Locale
}

/**
 * The lead itself. Nothing is written to a database, so this email is the record: without
 * it the footer form would be a polite way of throwing an address away.
 */
export function BuildLogNotificationEmail({ email, locale }: Readonly<BuildLogNotificationEmailProps>): JSX.Element {
  const t = translator()

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

BuildLogNotificationEmail.PreviewProps = {
  email: "ada@example.com",
  locale: I18N.DEFAULT_LOCALE,
} satisfies BuildLogNotificationEmailProps
