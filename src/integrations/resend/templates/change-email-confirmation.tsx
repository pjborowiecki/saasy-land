import type { JSX } from "react"

import { createTranslator } from "next-intl"
import { Body, Button, Container, Head, Heading, Html, Preview, Section, Tailwind, Text } from "react-email"

import { CONSTANTS } from "~/src/constants"
import type { Locale } from "~/src/constants/types"

interface ChangeEmailConfirmationEmailProps {
  readonly confirmUrl: string
  readonly locale: Locale
  readonly name: string
  readonly newEmail: string
}

export async function ChangeEmailConfirmationEmail({
  confirmUrl,
  locale,
  name,
  newEmail,
}: Readonly<ChangeEmailConfirmationEmailProps>): Promise<JSX.Element> {
  const { default: messages } = await import(`~/src/integrations/next-intl/messages/${locale}.json`)
  const t = createTranslator({ locale, messages, namespace: "emails.changeEmailConfirmation" })

  return (
    <Html>
      <Head />
      <Preview>{t("preview")}</Preview>
      <Tailwind>
        <Body className="font-sans">
          <Container className="mx-auto px-5 py-10">
            <Section>
              <Heading className="m-0 mb-4 font-bold text-2xl">{t("heading")}</Heading>
              <Text className="m-0 mb-6 text-base text-neutral-600">{t("body", { name, newEmail })}</Text>
              <Button href={confirmUrl} className="rounded-md bg-neutral-900 px-5 py-3 text-center text-base text-white no-underline">
                {t("button")}
              </Button>
              <Text className="mt-6 text-neutral-500 text-sm">{t("footer")}</Text>
            </Section>
          </Container>
        </Body>
      </Tailwind>
    </Html>
  )
}

ChangeEmailConfirmationEmail.PreviewProps = {
  confirmUrl: "https://saasyland.com/en/auth/verify-email?token=12345",
  locale: CONSTANTS.I18N.DEFAULT_LOCALE,
  name: "John Doe",
  newEmail: "john.doe@example.com",
} satisfies ChangeEmailConfirmationEmailProps
