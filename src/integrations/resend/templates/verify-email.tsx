import type { JSX } from "react"

import { Body, Button, Container, Head, Heading, Html, Preview, Section, Tailwind, Text } from "react-email"

import { CONSTANTS } from "~/src/constants"
import type { Locale } from "~/src/constants/types"

import { createNamespacedTranslator, loadLocaleMessages } from "~/src/lib/_utils/i18n"

interface VerifyEmailProps {
  readonly locale: Locale
  readonly name: string
  readonly verifyUrl: string
}

export async function VerifyEmail({ locale, name, verifyUrl }: Readonly<VerifyEmailProps>): Promise<JSX.Element> {
  const messages = await loadLocaleMessages(locale)
  const t = createNamespacedTranslator(messages, locale, "emails.verifyEmail")

  return (
    <Html>
      <Head />
      <Preview>{t("preview")}</Preview>
      <Tailwind>
        <Body className="font-sans">
          <Container className="mx-auto px-5 py-10">
            <Section>
              <Heading className="m-0 mb-4 text-2xl font-bold">{t("heading")}</Heading>
              <Text className="m-0 mb-6 text-base text-neutral-600">{t("body", { name })}</Text>
              <Button href={verifyUrl} className="rounded-md bg-neutral-900 px-5 py-3 text-center text-base text-white no-underline">
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

VerifyEmail.PreviewProps = {
  locale: CONSTANTS.I18N.DEFAULT_LOCALE,
  name: "John Doe",
  verifyUrl: "https://saasyland.com/en/auth/verify-email?token=12345",
} satisfies VerifyEmailProps
