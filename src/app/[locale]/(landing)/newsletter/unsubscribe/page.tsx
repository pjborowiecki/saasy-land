import type { Metadata } from "next"
import type { JSX } from "react"

import { getTranslations } from "next-intl/server"

import { NEWSLETTER_TOKEN_LENGTH } from "~/src/modules/newsletter-subscriber/newsletter-subscriber.schema"
import { unsubscribeFromNewsletter } from "~/src/modules/newsletter-subscriber/use-cases/unsubscribe-from-newsletter.use-case"

import { UnsubscribeConfirmation } from "~/src/app/[locale]/(landing)/newsletter/unsubscribe/_components/unsubscribe-confirmation"

export const instant = false

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations("pages.newsletter.unsubscribe")

  return {
    description: t("description"),
    robots: { follow: false, index: false },
    title: t("title"),
  }
}

export default async function UnsubscribePage({ searchParams }: PageProps<"/[locale]/newsletter/unsubscribe">): Promise<JSX.Element> {
  const { token } = await searchParams
  const t = await getTranslations("pages.newsletter.unsubscribe")

  if (typeof token === "string" && token.length === NEWSLETTER_TOKEN_LENGTH) {
    await unsubscribeFromNewsletter({ token })
  }

  return <UnsubscribeConfirmation body={t("body")} note={t("note")} resubscribe={t("resubscribe")} title={t("title")} />
}
