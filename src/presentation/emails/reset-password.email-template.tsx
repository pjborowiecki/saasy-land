import type { JSX } from "react"

import { createTranslator } from "next-intl"
import { Body, Button, Container, Head, Heading, Html, pixelBasedPreset, Preview, Section, Tailwind, Text } from "react-email"

import { I18N, type Locale } from "~/src/integrations/next-intl/i18n.config"
import { loadLocaleMessagesFromDir } from "~/src/integrations/next-intl/i18n.utils"

const TAILWIND_CONFIG = { presets: [pixelBasedPreset] }

export function resetPasswordSubject(locale: Locale): string {
  return createTranslator({ locale, messages: loadLocaleMessagesFromDir(locale), namespace: "emails.resetPassword" })("subject")
}

interface ResetPasswordEmailProps {
  readonly locale: Locale
  readonly name: string
  readonly resetPasswordUrl: string
}

export function ResetPasswordEmail({ locale, name, resetPasswordUrl }: Readonly<ResetPasswordEmailProps>): JSX.Element {
  const t = createTranslator({ locale, messages: loadLocaleMessagesFromDir(locale), namespace: "emails.resetPassword" })

  return (
    <Html lang={locale}>
      <Tailwind config={TAILWIND_CONFIG}>
        <Head />
        <Body className="font-sans">
          <Preview>{t("preview")}</Preview>
          <Container className="mx-auto px-5 py-10">
            <Section>
              <Heading className="m-0 mb-4 text-2xl font-bold">{t("heading")}</Heading>
              <Text className="m-0 mb-6 text-base text-neutral-600">{t("body", { name })}</Text>
              <Button
                href={resetPasswordUrl}
                className="box-border rounded-md bg-neutral-900 px-5 py-3 text-center text-base text-white no-underline"
              >
                {t("button")}
              </Button>
              <Text className="mt-6 text-sm text-neutral-500">{t("footer")}</Text>
            </Section>
          </Container>
        </Body>
      </Tailwind>
    </Html>
  )
}

ResetPasswordEmail.PreviewProps = {
  locale: I18N.DEFAULT_LOCALE,
  name: "John Doe",
  resetPasswordUrl: "https://saasyland.com/en/auth/reset-password?token=12345",
} satisfies ResetPasswordEmailProps
