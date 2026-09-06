import type { JSX } from "react"

import { Body, Button, Container, Head, Heading, Html, Preview, Section, Tailwind, Text, pixelBasedPreset } from "react-email"
import { createTranslator } from "use-intl"

import { I18N, type Locale } from "~/src/integrations/use-intl/i18n.config"
import { getEmailMessages } from "~/src/integrations/use-intl/i18n.emails"

const TAILWIND_CONFIG = { presets: [pixelBasedPreset] }

export const changeEmailConfirmationSubject = (locale: Locale): string =>
  createTranslator({ locale, messages: getEmailMessages(locale), namespace: "emails.changeEmailConfirmation" })("subject")

interface ChangeEmailConfirmationEmailProps {
  readonly confirmUrl: string
  readonly locale: Locale
  readonly name: string
  readonly newEmail: string
}

export const ChangeEmailConfirmationEmail = ({
  confirmUrl,
  locale,
  name,
  newEmail,
}: Readonly<ChangeEmailConfirmationEmailProps>): JSX.Element => {
  const t = createTranslator({ locale, messages: getEmailMessages(locale), namespace: "emails.changeEmailConfirmation" })

  return (
    <Html lang={locale}>
      <Tailwind config={TAILWIND_CONFIG}>
        <Head />
        <Body className="font-sans">
          <Preview>{t("preview")}</Preview>
          <Container className="mx-auto px-5 py-10">
            <Section>
              <Heading className="m-0 mb-4 text-2xl font-bold">{t("heading")}</Heading>
              <Text className="m-0 mb-6 text-base text-neutral-600">{t("body", { name, newEmail })}</Text>
              <Button
                href={confirmUrl}
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

ChangeEmailConfirmationEmail.PreviewProps = {
  confirmUrl: "https://saasyland.com/auth/change-email?token=12345",
  locale: I18N.DEFAULT_LOCALE,
  name: "John Doe",
  newEmail: "new@example.com",
} satisfies ChangeEmailConfirmationEmailProps
