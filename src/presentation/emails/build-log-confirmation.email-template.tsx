import type { JSX } from "react"

import { createTranslator } from "next-intl"
import { Body, Button, Container, Head, Heading, Html, pixelBasedPreset, Preview, Section, Tailwind, Text } from "react-email"

import { I18N, type Locale } from "~/src/integrations/next-intl/i18n.config"
import { loadLocaleMessagesFromDir } from "~/src/integrations/next-intl/i18n.utils"

import { CONTACT_EMAIL } from "~/src/presentation/branding"

const NAMESPACE = "emails.buildLog.confirmation"
const TAILWIND_CONFIG = { presets: [pixelBasedPreset] }

function translator(locale: Locale) {
  return createTranslator({ locale, messages: loadLocaleMessagesFromDir(locale), namespace: NAMESPACE })
}

export function buildLogConfirmationSubject(locale: Locale): string {
  return translator(locale)("subject")
}

interface BuildLogConfirmationEmailProps {
  readonly locale: Locale
}

/**
 * The kept half of the footer's promise: the subscriber hears back immediately, in the
 * language they signed up in.
 *
 * The build log is not stored anywhere, so the unsubscribe is a prefilled message to the
 * one address that owns the list. That is genuinely one click, and it is the only version
 * of "unsubscribe" this system can honour without inventing a table for it.
 */
export function BuildLogConfirmationEmail({ locale }: Readonly<BuildLogConfirmationEmailProps>): JSX.Element {
  const t = translator(locale)
  const unsubscribeUrl = `mailto:${CONTACT_EMAIL}?subject=${encodeURIComponent(t("button"))}`

  return (
    <Html lang={locale}>
      <Tailwind config={TAILWIND_CONFIG}>
        <Head />
        <Body className="font-sans">
          <Preview>{t("preview")}</Preview>
          <Container className="mx-auto px-5 py-10">
            <Section>
              <Heading className="m-0 mb-4 text-2xl font-bold">{t("heading")}</Heading>
              <Text className="m-0 mb-6 text-base text-neutral-600">{t("body")}</Text>
              <Button
                href={unsubscribeUrl}
                className="box-border rounded-md bg-neutral-900 px-5 py-3 text-center text-base text-white no-underline"
              >
                {t("button")}
              </Button>
              <Text className="mt-6 text-sm text-neutral-500">{t("footer", { contactEmail: CONTACT_EMAIL })}</Text>
            </Section>
          </Container>
        </Body>
      </Tailwind>
    </Html>
  )
}

BuildLogConfirmationEmail.PreviewProps = {
  locale: I18N.DEFAULT_LOCALE,
} satisfies BuildLogConfirmationEmailProps
