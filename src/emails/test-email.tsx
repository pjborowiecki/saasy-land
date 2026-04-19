import type { JSX } from "react"

import { createTranslator } from "next-intl"
import { Body, Container, Head, Heading, Html, Preview, Section, Tailwind } from "react-email"

import type { Locale } from "~/src/constants/types"

interface TestEmailProps {
  locale: Locale
}

export default async function TestEmail({ locale }: Readonly<TestEmailProps>): Promise<JSX.Element> {
  const t = createTranslator({
    locale,
    namespace: "emails.testEmail",
    messages: await import(`~/src/integrations/next-intl/messages/${locale}.json`),
  })

  return (
    <Html>
      <Head />
      <Preview>{t("test")}</Preview>
      <Tailwind>
        <Body className="font-sans">
          <Container className="mx-auto px-5 py-10">
            <Section>
              <Heading className="m-0 mb-4 font-bold text-2xl">{t("test")}</Heading>
            </Section>
          </Container>
        </Body>
      </Tailwind>
    </Html>
  )
}
